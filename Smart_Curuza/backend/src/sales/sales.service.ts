import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { ClientManagementService } from '../client-management/client-management.service';
import { BatchesService } from '../batches/batches.service';
import { NotificationsService } from '../notifications/notifications.service';

import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleItem } from './sales.types';
@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly clientService: ClientManagementService,
    private readonly batchesService: BatchesService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const { total, clientName, clientPhone, merchantId, userId } = saleData;
    let { paymentMethod, customerId } = saleData;
    const items = saleData.items as SaleItem[];

    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required');
    }

    // Normalize payment method casing
    if (paymentMethod?.toUpperCase() === 'CREDIT') paymentMethod = 'Credit';

    this.logger.log(
      `Creating sale: ${items.length} items, Total: ${total}, Method: ${paymentMethod}, User: ${userId}`,
    );

    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 0. Find or Create Customer if CRM details are provided
      if (!customerId && clientPhone && clientName) {
        this.logger.log(
          `Attempting to find/create customer: ${clientName} (${clientPhone})`,
        );
        const customer: Customer = await this.clientService.getOrCreateCustomer(
          merchantId,
          clientPhone,
          clientName,
          queryRunner.manager,
        );
        customerId = customer.id;
        this.logger.log(`Using customer: ${clientName} ID: ${customerId}`);
      }

      // Calculate VAT (Inclusive 18%)
      const VAT_RATE = 0.18;
      const netAmount = Number(total) / (1 + VAT_RATE);
      const vatAmount = Number(total) - netAmount;

      // 1. Create Sale Record
      const saleInput = {
        merchant_id: merchantId,
        customer_id: customerId || undefined,
        user_id: userId || undefined,
        total,
        vat_amount: Number(vatAmount.toFixed(2)),
        net_amount: Number(netAmount.toFixed(2)),
        payment_method: paymentMethod,
        items: items,
        created_at: new Date(),
        sync_status: 'Completed',
      };

      const sale = this.saleRepository.create(saleInput);
      const savedSale = await queryRunner.manager.save(sale);

      // 2. Update Stock
      for (const item of items) {
        const product = await this.productRepository.findOne({
          where: { id: item.id },
          relations: ['batches'],
        });

        if (!product) {
          throw new BadRequestException(
            `Product ${item.name || item.id} not found.`,
          );
        }

        const activeBatches =
          product.batches?.filter((b) => b.status === 'active') || [];
        const availableStock = activeBatches.reduce(
          (sum, b) => sum + Number(b.current_quantity),
          0,
        );

        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name} (ID: ${product.id}). Available: ${availableStock.toFixed(2)}, Requested: ${item.quantity}`,
          );
        }

        product.stock = availableStock - item.quantity;

        // Auto-deactivate if stock reaches 0
        if (product.stock <= 0) {
          product.status = 'inactive';
          this.logger.warn(
            `STOCK OUT ALERT: Product ${product.name} is now out of stock.`,
          );

          // Push Notification
          await this.notificationsService.create({
            title: 'Stock Out Alert',
            message: `Product "${product.name}" is out of stock and has been deactivated.`,
            type: 'warning',
            user_id: undefined,
          });
        }

        await queryRunner.manager.save(product);

        // Deduct from batches
        const preferredBatchId = item.batchId || undefined;
        const batchUsage = await this.batchesService.deductStock(
          item.id,
          item.quantity,
          queryRunner.manager,
          preferredBatchId,
        );
        item.batches = batchUsage;
      }

      // Update sale with new items info (containing batch details)
      savedSale.items = items;
      await queryRunner.manager.save(savedSale);

      // 3. Handle Credit Sale (Debt)
      if (paymentMethod === 'Credit') {
        if (!customerId) {
          throw new BadRequestException(
            'Customer ID is required for credit sales',
          );
        }

        await this.clientService.createDebtRecord(
          {
            customerId: customerId,
            saleId: savedSale.id,
            amountDue: total,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      // Notification for New Sale
      await this.notificationsService.create({
        title: 'New Sale Recorded',
        message: `Sale #${savedSale.id.substring(0, 8)} completed. Total: ${savedSale.total} RWF.`,
        type: 'success',
      });

      return savedSale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Sale transaction failed', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async refundSale(
    saleId: string,
    reason: string,
    shouldRestock: boolean,
    merchantId: string,
  ): Promise<Sale> {
    this.logger.log(`Refunding sale ${saleId}. Restock: ${shouldRestock}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await this.saleRepository.findOne({
        where: { id: saleId },
      });

      if (!sale) {
        throw new NotFoundException(`Sale with ID ${saleId} not found`);
      }

      if (sale.merchant_id !== merchantId) {
        throw new UnauthorizedException('Access to this sale is denied');
      }

      if (sale.status === 'REFUNDED') {
        throw new BadRequestException(`Sale ${saleId} is already refunded`);
      }

      // 1. Update Sale Status
      sale.sync_status = 'Refunded';
      // sale.status = 'REFUNDED'; // Uncomment if status column exists and is needed
      await queryRunner.manager.save(sale);

      // 2. Restore Stock
      if (shouldRestock && sale.items) {
        const items = sale.items;
        for (const item of items) {
          const product = await this.productRepository.findOne({
            where: { id: item.id },
          });

          if (product) {
            product.stock += Number(item.quantity);
            // Reactivate if it was inactive due to stock out
            if (product.status === 'inactive' && product.stock > 0) {
              product.status = 'active';
            }
            await queryRunner.manager.save(product);
          }
        }
      }

      // 3. Cancel Debt (if Credit)
      if (sale.payment_method === 'Credit') {
        await this.clientService.cancelDebt(sale.id, queryRunner.manager);
      }

      await queryRunner.commitTransaction();

      // Notification
      await this.notificationsService.create({
        title: 'Sale Refunded',
        message: `Sale #${sale.id.substring(0, 8)} has been refunded.`,
        type: 'info',
      });

      return sale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Refund failed', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(merchantId: string): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { merchant_id: merchantId },
      relations: ['customer', 'merchant', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async getRecentSales(limit: number, merchantId: string): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { merchant_id: merchantId },
      relations: ['customer', 'user'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getSalesByStaff(
    startDate: string,
    endDate: string,
    merchantId: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sales = await this.saleRepository.find({
      where: {
        merchant_id: merchantId,
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    // Filter by date manually to avoid import issues for now
    const filteredSales = sales.filter(
      (s) => s.created_at >= start && s.created_at <= end,
    );

    const staffStats = new Map<
      string,
      { name: string; count: number; total: number }
    >();

    for (const sale of filteredSales) {
      const userName = sale.user
        ? sale.user.name || sale.user.email || sale.user.phone
        : 'Unknown/Owner';
      const current = staffStats.get(userName) || {
        name: userName,
        count: 0,
        total: 0,
      };

      staffStats.set(userName, {
        name: userName,
        count: current.count + 1,
        total: current.total + Number(sale.total),
      });
    }

    return Array.from(staffStats.values());
  }

  async getSalesReport(startDate: string, endDate: string, merchantId: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the whole end day

    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.merchant_id = :merchantId', { merchantId })
      .andWhere('sale.created_at BETWEEN :start AND :end', { start, end })
      .orderBy('sale.created_at', 'ASC')
      .getMany();

    // 1. Get all unique product IDs from the sales to fetch their default costs
    const productIds = new Set<string>();
    for (const sale of sales) {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item) => {
          if (item.id) productIds.add(item.id);
        });
      }
    }

    const products = await this.productRepository.findByIds(
      Array.from(productIds),
    );
    const costMap = new Map<string, number>();
    products.forEach((p) => costMap.set(p.id, Number(p.cost_price) || 0));

    // 2. Aggregate data by day
    const dailyStats = new Map<
      string,
      {
        date: string;
        revenue: number;
        profit: number;
        count: number;
        vat: number;
      }
    >();

    for (const sale of sales) {
      const dateKey = sale.created_at.toISOString().split('T')[0]; // YYYY-MM-DD

      let saleProfit = 0;
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        items.forEach((item) => {
          if (
            item.batches &&
            Array.isArray(item.batches) &&
            item.batches.length > 0
          ) {
            item.batches.forEach((batch) => {
              saleProfit +=
                Number(item.price) * Number(batch.quantity) -
                Number(batch.costPrice) * Number(batch.quantity);
            });
          } else {
            // FALLBACK: Use default product cost price
            const defaultCost = costMap.get(item.id) || 0;
            saleProfit +=
              (Number(item.price) - defaultCost) * Number(item.quantity);
          }
        });
      }

      const current = dailyStats.get(dateKey) || {
        date: dateKey,
        revenue: 0,
        profit: 0,
        count: 0,
        vat: 0,
      };

      dailyStats.set(dateKey, {
        date: dateKey,
        revenue: current.revenue + Number(sale.total),
        profit: current.profit + saleProfit,
        count: current.count + 1,
        vat: current.vat + (Number(sale.vat_amount) || 0),
      });
    }

    return Array.from(dailyStats.values());
  }

  async deleteNegativeProfitSales(): Promise<number> {
    const sales = await this.saleRepository.find();
    const salesToDelete: Sale[] = [];

    for (const sale of sales) {
      let saleProfit = 0;
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        items.forEach((item) => {
          if (item.batches && Array.isArray(item.batches)) {
            item.batches.forEach((batch) => {
              saleProfit +=
                Number(item.price) * Number(batch.quantity) -
                Number(batch.costPrice) * Number(batch.quantity);
            });
          } else {
            // If no batch info, we can't determine cost, so assume positive (or ignore)
            // But user specifically wants to delete negative profit ones.
            // If cost is 0, profit is positive.
            saleProfit += Number(item.price) * Number(item.quantity);
          }
        });
      }

      if (saleProfit < 0) {
        salesToDelete.push(sale);
      }
    }

    if (salesToDelete.length > 0) {
      await this.saleRepository.remove(salesToDelete);
    }

    return salesToDelete.length;
  }
  async getExportData(
    period: 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    merchantId: string,
  ): Promise<any> {
    const sales = await this.saleRepository.find({
      where: { merchant_id: merchantId },
      relations: ['customer'],
      order: { created_at: 'ASC' },
    });

    // Notification for Export
    await this.notificationsService.create({
      title: 'Report Exported',
      message: `Sales report (${period}) exported.`,
      type: 'info',
    });

    // Get all products for cost fallback in detailed list
    const productIdsSet = new Set<string>();
    sales.forEach((s) =>
      s.items?.forEach((i) => i.id && productIdsSet.add(i.id)),
    );
    const productsList = await this.productRepository.findByIds(
      Array.from(productIdsSet),
    );
    const costLookup = new Map<string, number>();
    productsList.forEach((p) =>
      costLookup.set(p.id, Number(p.cost_price) || 0),
    );

    // 1. Detailed Transactions List
    const detailedTransactions = sales.map((sale) => {
      let saleCost = 0;
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        items.forEach((item) => {
          if (
            item.batches &&
            Array.isArray(item.batches) &&
            item.batches.length > 0
          ) {
            item.batches.forEach((batch) => {
              saleCost += Number(batch.costPrice) * Number(batch.quantity);
            });
          } else {
            // FALLBACK
            const defaultCost = costLookup.get(item.id) || 0;
            saleCost += defaultCost * Number(item.quantity);
          }
        });
      }

      const totalRevenue = Number(sale.total);
      const totalVat = Number(sale.vat_amount) || 0;

      return {
        id: sale.id,
        date: sale.created_at,
        customer: sale.customer ? sale.customer.name : 'Walk-in',
        items: sale.items.map((i) => `${i.name} (x${i.quantity})`).join('; '),
        total: totalRevenue,
        cost: saleCost,
        profit: totalRevenue - saleCost - totalVat,
        vat: totalVat,
        paymentMethod: sale.payment_method,
        status: sale.sync_status,
      };
    });

    // 2. Aggregated Data
    const groupedData = new Map<
      string,
      {
        period: string;
        revenue: number;
        cost: number;
        profit: number;
        vat: number;
        transactions: number;
      }
    >();

    for (const sale of sales) {
      const date = new Date(sale.created_at);
      let key = '';
      let periodLabel = '';

      if (period === 'weekly') {
        const year = date.getFullYear();
        const week = this.getWeekNumber(date);
        key = `${year}-W${week}`;
        periodLabel = `Week ${week}, ${year}`;
      } else if (period === 'monthly') {
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        key = `${year}-${date.getMonth()}`;
        periodLabel = `${month} ${year}`;
      } else if (period === 'quarterly') {
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${year}-Q${quarter}`;
        periodLabel = `Q${quarter} ${year}`;
      } else if (period === 'yearly') {
        const year = date.getFullYear();
        key = `${year}`;
        periodLabel = `${year}`;
      }

      let saleCost = 0;
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        items.forEach((item) => {
          if (
            item.batches &&
            Array.isArray(item.batches) &&
            item.batches.length > 0
          ) {
            item.batches.forEach((batch) => {
              saleCost += Number(batch.costPrice) * Number(batch.quantity);
            });
          } else {
            // FALLBACK
            const defaultCost = costLookup.get(item.id) || 0;
            saleCost += defaultCost * Number(item.quantity);
          }
        });
      }

      const current = groupedData.get(key) || {
        period: periodLabel,
        revenue: 0,
        cost: 0,
        profit: 0,
        vat: 0,
        transactions: 0,
      };

      const saleVat = Number(sale.vat_amount) || 0;
      const saleRevenue = Number(sale.total);

      groupedData.set(key, {
        period: periodLabel,
        revenue: current.revenue + saleRevenue,
        cost: current.cost + saleCost,
        profit: current.profit + (saleRevenue - saleCost - saleVat),
        vat: current.vat + saleVat,
        transactions: current.transactions + 1,
      });
    }

    return {
      summary: Array.from(groupedData.values()),
      details: detailedTransactions,
    };
  }

  async getSalesByCustomer(customerId: string, merchantId: string) {
    return this.saleRepository.find({
      where: {
        customer_id: customerId,
        merchant_id: merchantId,
      },
      order: { created_at: 'DESC' },
    });
  }

  private getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return weekNo;
  }

  async getSalesByCategory(
    startDate: string,
    endDate: string,
    merchantId: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.merchant_id = :merchantId', { merchantId })
      .andWhere('sale.created_at BETWEEN :start AND :end', { start, end })
      .getMany();

    const categoryStats = new Map<
      string,
      { name: string; total: number; count: number }
    >();

    for (const sale of sales) {
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        for (const item of items) {
          const category = item.category || 'General';
          const current = categoryStats.get(category) || {
            name: category,
            total: 0,
            count: 0,
          };

          categoryStats.set(category, {
            name: category,
            total: current.total + Number(item.price) * Number(item.quantity),
            count: current.count + Number(item.quantity),
          });
        }
      }
    }

    return Array.from(categoryStats.values());
  }

  async getSalesByProduct(
    startDate: string,
    endDate: string,
    merchantId: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.merchant_id = :merchantId', { merchantId })
      .andWhere('sale.created_at BETWEEN :start AND :end', { start, end })
      .getMany();

    const productStats = new Map<
      string,
      { name: string; total: number; count: number }
    >();

    for (const sale of sales) {
      if (sale.items && Array.isArray(sale.items)) {
        const items = sale.items;
        for (const item of items) {
          const productName = item.name || 'Unknown Product';
          const current = productStats.get(productName) || {
            name: productName,
            total: 0,
            count: 0,
          };

          productStats.set(productName, {
            name: productName,
            total: current.total + Number(item.price) * Number(item.quantity),
            count: current.count + Number(item.quantity),
          });
        }
      }
    }

    return Array.from(productStats.values()).sort((a, b) => b.total - a.total);
  }

  async getRawQuery(query: string, params: any[]): Promise<any[]> {
    return this.saleRepository.query(query, params);
  }
}
