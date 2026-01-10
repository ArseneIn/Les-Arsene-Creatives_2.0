import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { Product } from '../entities/product.entity';
import { Batch } from '../entities/batch.entity';
import { Expense } from '../entities/expense.entity';
import { Sale } from '../entities/sale.entity';
import { Customer } from '../entities/customer.entity';
import { DebtLedger } from '../entities/debt-ledger.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    private entityManager: EntityManager,
  ) {}

  async getStats() {
    const totalUsers = await this.userRepository.count();
    const activeMerchants = await this.merchantRepository.count({
      where: { subscription_status: 'ACTIVE' },
    });
    const totalMerchants = await this.merchantRepository.count();

    // Calculate system health based on active vs total merchants (simple metric)
    const systemHealth =
      totalMerchants > 0
        ? Math.round((activeMerchants / totalMerchants) * 100)
        : 100;

    // Pending requests: Merchants in TRIAL status
    const pendingRequests = await this.merchantRepository.count({
      where: { subscription_status: 'TRIAL' },
    });

    return {
      totalUsers,
      activeMerchants,
      totalMerchants,
      systemHealth,
      pendingRequests,
    };
  }

  async getActivity() {
    // Get recent users
    const recentUsers = await this.userRepository.find({
      order: { created_at: 'DESC' },
      take: 5,
      relations: ['merchant'],
    });

    return recentUsers.map((user) => ({
      type: 'USER_REGISTRATION',
      description: `New user ${user.name || user.email} registered`,
      time: user.created_at,
      status: 'Completed',
    }));
  }

  async getAlerts() {
    // Mock alerts
    return [
      {
        title: 'High server load',
        time: new Date(Date.now() - 3600000), // 1 hour ago
        type: 'Warning',
      },
      {
        title: 'Database backup successful',
        time: new Date(Date.now() - 7200000), // 2 hours ago
        type: 'Info',
      },
    ];
  }

  async getMerchants() {
    return this.merchantRepository.find({
      relations: ['owner'],
      order: { created_at: 'DESC' },
    });
  }

  async updateSubscription(
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'TRIAL',
    expiryDate?: Date,
  ) {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    merchant.subscription_status = status;
    if (expiryDate) {
      merchant.subscription_expiry = expiryDate;
    } else if (status === 'ACTIVE' && !merchant.subscription_expiry) {
      // Default to 1 year if activating and no expiry set
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      merchant.subscription_expiry = nextYear;
    }

    return this.merchantRepository.save(merchant);
  }

  async toggleLock(id: string) {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    merchant.lock_status =
      merchant.lock_status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED';
    return this.merchantRepository.save(merchant);
  }

  async deleteOrphanMerchants() {
    // 1. Find orphan merchants (no owner)
    const orphans = await this.merchantRepository
      .createQueryBuilder('merchant')
      .leftJoinAndSelect('merchant.owner', 'owner')
      .where('owner.id IS NULL')
      .getMany();

    const orphanIds = orphans.map((m) => m.id);

    if (orphanIds.length > 0) {
      await this.entityManager.transaction(async (manager) => {
        // 2. Unlink users from these merchants
        await manager
          .createQueryBuilder()
          .update(User)
          .set({ merchant: null as any })
          .where('merchantId IN (:...ids)', { ids: orphanIds })
          .execute();

        // 3. Delete related data
        // Batches (via Product relation, but need to be explicit if no cascade)
        // Need to find products first to delete batches?
        // Or delete batches where product.merchantId IN orphanIds
        // But Batch doesn't have merchantId directly usually, it links to Product.
        // Let's check Batch entity. Assuming it links to Product.
        // If Batch links to Product, we can delete using subquery or join.
        // "DELETE FROM batches WHERE product_id IN (SELECT id FROM products WHERE merchant_id IN (...))"

        // Using TypeORM with subqueries might be verbose.
        // Let's try to delete Batches using query builder with subquery logic if possible,
        // or just fetch products and delete batches.

        const products = await manager.find(Product, {
          where: { merchant: { id: In(orphanIds) } },
          select: ['id'],
        });
        const productIds = products.map((p) => p.id);

        if (productIds.length > 0) {
          await manager.delete(Batch, { product: { id: In(productIds) } });
        }

        // Delete Products
        await manager.delete(Product, { merchant: { id: In(orphanIds) } });

        // Expenses
        await manager.delete(Expense, { merchant: { id: In(orphanIds) } });

        // DebtLedger (linked to Sale)
        // Need to find sales first
        const sales = await manager.find(Sale, {
          where: { merchant: { id: In(orphanIds) } },
          select: ['id'],
        });
        const saleIds = sales.map((s) => s.id);

        if (saleIds.length > 0) {
          await manager.delete(DebtLedger, { sale: { id: In(saleIds) } });
        }

        // Sales
        await manager.delete(Sale, { merchant: { id: In(orphanIds) } });

        // Customers
        await manager.delete(Customer, { merchant: { id: In(orphanIds) } });

        // 4. Delete the merchants
        await manager.delete(Merchant, orphanIds);
      });

      return { affected: orphanIds.length };
    }

    return { affected: 0 };
  }
}
