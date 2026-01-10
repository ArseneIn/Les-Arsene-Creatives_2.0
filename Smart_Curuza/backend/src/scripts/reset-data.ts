import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EntityManager, Not, In } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { Product } from '../entities/product.entity';
import { Batch } from '../entities/batch.entity';
import { Expense } from '../entities/expense.entity';
import { Sale } from '../entities/sale.entity';
import { Customer } from '../entities/customer.entity';
import { DebtLedger } from '../entities/debt-ledger.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const manager = app.get(EntityManager);

  console.log('Starting data reset...');

  try {
    // 1. Ensure Superadmin exists
    let superAdmin = await manager.findOne(User, {
      where: { email: 'admin@smartcuruza.com' },
    });
    if (!superAdmin) {
      console.log('Creating Superadmin...');
      superAdmin = new User();
      superAdmin.email = 'admin@smartcuruza.com';
      superAdmin.password = await bcrypt.hash('password123', 10);
      superAdmin.role = UserRole.SUPERADMIN;
      superAdmin.name = 'Super Admin';
      await manager.save(superAdmin);
    } else {
      console.log('Superadmin exists.');
      if (superAdmin.role !== UserRole.SUPERADMIN) {
        superAdmin.role = UserRole.SUPERADMIN;
        await manager.save(superAdmin);
      }
    }

    // 2. Ensure Merchant "Murokore shop" exists
    let merchant = await manager.findOne(Merchant, {
      where: { business_name: 'Murokore shop' },
    });
    if (!merchant) {
      console.log('Creating Murokore shop...');
      merchant = new Merchant();
      merchant.business_name = 'Murokore shop';
      merchant.device_id =
        'DEVICE-' + Math.random().toString(36).substring(7).toUpperCase();
      merchant.subscription_status = 'ACTIVE';
      merchant.address = 'Kigali, Rwanda';
      merchant.phone = '+250 788 111 222';
      await manager.save(merchant);
    } else {
      console.log('Murokore shop exists.');
    }

    // 3. Ensure Owner "Kalisa" exists and is linked
    let kalisa = await manager.findOne(User, {
      where: { email: 'kalisa@smartcuruza.com' },
    });
    if (!kalisa) {
      kalisa = await manager.findOne(User, { where: { name: 'Kalisa' } });
    }

    if (!kalisa) {
      console.log('Creating Kalisa...');
      kalisa = new User();
      kalisa.name = 'Kalisa';
      kalisa.email = 'kalisa@smartcuruza.com';
      kalisa.password = await bcrypt.hash('password123', 10);
      kalisa.role = UserRole.MERCHANT;
      kalisa.merchant = merchant;
      await manager.save(kalisa);
    } else {
      console.log('Kalisa exists.');
      kalisa.merchant = merchant;
      kalisa.role = UserRole.MERCHANT;
      await manager.save(kalisa);
    }

    // Link merchant to owner
    merchant.owner = kalisa;
    await manager.save(merchant);

    // 4. Delete everything else
    const keepUserIds = [superAdmin.id, kalisa.id];
    const keepMerchantIds = [merchant.id];

    console.log('Deleting other data...');

    await manager.transaction(async (transactionalManager) => {
      // Find merchants to delete
      const merchantsToDelete = await transactionalManager.find(Merchant, {
        where: { id: Not(In(keepMerchantIds)) },
        select: ['id'],
      });
      const merchantIdsToDelete = merchantsToDelete.map((m) => m.id);

      if (merchantIdsToDelete.length > 0) {
        console.log(`Found ${merchantIdsToDelete.length} merchants to delete.`);

        // Unlink users from these merchants first
        await transactionalManager
          .createQueryBuilder()
          .update(User)
          .set({ merchant: null as any })
          .where('merchantId IN (:...ids)', { ids: merchantIdsToDelete })
          .execute();

        // Delete related data for these merchants
        const products = await transactionalManager.find(Product, {
          where: { merchant: { id: In(merchantIdsToDelete) } },
          select: ['id'],
        });
        const productIds = products.map((p) => p.id);

        if (productIds.length > 0) {
          await transactionalManager.delete(Batch, {
            product: { id: In(productIds) },
          });
        }
        await transactionalManager.delete(Product, {
          merchant: { id: In(merchantIdsToDelete) },
        });
        await transactionalManager.delete(Expense, {
          merchant: { id: In(merchantIdsToDelete) },
        });

        const sales = await transactionalManager.find(Sale, {
          where: { merchant: { id: In(merchantIdsToDelete) } },
          select: ['id'],
        });
        const saleIds = sales.map((s) => s.id);
        if (saleIds.length > 0) {
          await transactionalManager.delete(DebtLedger, {
            sale: { id: In(saleIds) },
          });
        }
        await transactionalManager.delete(Sale, {
          merchant: { id: In(merchantIdsToDelete) },
        });
        await transactionalManager.delete(Customer, {
          merchant: { id: In(merchantIdsToDelete) },
        });

        // Finally delete merchants
        await transactionalManager.delete(Merchant, merchantIdsToDelete);
      }

      // Delete users
      const usersToDelete = await transactionalManager.find(User, {
        where: { id: Not(In(keepUserIds)) },
        select: ['id'],
      });
      const userIdsToDelete = usersToDelete.map((u) => u.id);

      if (userIdsToDelete.length > 0) {
        console.log(`Found ${userIdsToDelete.length} users to delete.`);

        // Nullify user references in Expenses/Sales for kept merchant
        await transactionalManager.update(
          Expense,
          { user: { id: In(userIdsToDelete) } },
          { user: null as any },
        );
        await transactionalManager.update(
          Sale,
          { user: { id: In(userIdsToDelete) } },
          { user: null as any },
        );

        await transactionalManager.delete(User, userIdsToDelete);
      }
    });

    console.log('Reset complete.');
  } catch (error) {
    console.error('Error during reset:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
