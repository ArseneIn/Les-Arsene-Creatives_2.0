import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { ClientManagementService } from '../client-management/client-management.service';
import { BatchesService } from '../batches/batches.service';
import { NotificationsService } from '../notifications/notifications.service';

interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  batchId?: string;
  batches?: any[];
  category?: string;
}

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
  ) { }

  async createSale(saleData: any): Promise<Sale> {
    const { items, total, paymentMethod, customerId, merchantId, userId } =
      saleData;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.logger.log(
      `Creating sale: ${items.length} items, Total: ${total}, Method: ${paymentMethod}, User: ${userId}`,
    );

    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate VAT (Inclusive 18%)
      const VAT_RATE = 0.18;
      const netAmount = Number(total) / (1 + VAT_RATE);
      const vatAmount = Number(total) - netAmount;

      // 1. Create Sale Record
      const sale = this.saleRepository.create({
        merchant_id: merchantId,
        customer_id: customerId || null,
        user_id: userId || null,
        total,
        vat_amount: Number(vatAmount.toFixed(2)),
        net_amount: Number(netAmount.toFixed(2)),
        payment_method: paymentMethod,
        items: items as any,
        created_at: new Date(),
        sync_status: 'Completed',
      });
      const savedSale = await queryRunner.manager.save(sale);

      // 2. Update Stock
      for (const item of items as SaleItem[]) {
        const product = await this.productRepository.findOne({
          where: { id: item.id },
        });
        if (product) {
          product.stock -= item.quantity;

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
              user_id: undefined, // System-wide or link to merchant owner if we had context
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
            customerId: customerId as string,
            saleId: savedSale.id,
            amountDue: total,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
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

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['customer', 'merchant', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async getRecentSales(limit: number): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['customer', 'user'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getSalesByStaff(startDate: string, endDate: string, merchantId: string) {
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

    // Aggregate data by day
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
        (sale.items as unknown as SaleItem[]).forEach((item) => {
          if (item.batches && Array.isArray(item.batches)) {
            item.batches.forEach((batch: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              saleProfit +=
                Number(item.price) * Number(batch.quantity) -
                Number(batch.costPrice) * Number(batch.quantity);
            });
          } else {
            saleProfit += Number(item.price) * Number(item.quantity);
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
        (sale.items as unknown as SaleItem[]).forEach((item) => {
          if (item.batches && Array.isArray(item.batches)) {
            item.batches.forEach((batch: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    period: 'weekly' | 'monthly' | 'yearly',
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

    // 1. Detailed Transactions List
    const detailedTransactions = sales.map((sale) => {
      let saleCost = 0;
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          if (item.batches && Array.isArray(item.batches)) {
            item.batches.forEach((batch: any) => {
              saleCost += Number(batch.costPrice) * Number(batch.quantity);
            });
          }
        });
      }

      return {
        id: sale.id,
        date: sale.created_at,
        customer: sale.customer ? sale.customer.name : 'Walk-in',
        items: (sale.items as unknown as SaleItem[])
          .map((i) => `${i.name} (x${i.quantity})`)
          .join('; '),
        total: Number(sale.total),
        cost: saleCost,
        profit: Number(sale.total) - saleCost - (Number(sale.vat_amount) || 0),
        vat: Number(sale.vat_amount) || 0,
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
      } else if (period === 'yearly') {
        const year = date.getFullYear();
        key = `${year}`;
        periodLabel = `${year}`;
      }

      let saleCost = 0;
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          if (item.batches && Array.isArray(item.batches)) {
            item.batches.forEach((batch: any) => {
              saleCost += Number(batch.costPrice) * Number(batch.quantity);
            });
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

      groupedData.set(key, {
        period: periodLabel,
        revenue: current.revenue + Number(sale.total),
        cost: current.cost + saleCost,
        profit:
          current.profit +
          (Number(sale.total) - saleCost - (Number(sale.vat_amount) || 0)),
        vat: current.vat + (Number(sale.vat_amount) || 0),
        transactions: current.transactions + 1,
      });
    }

    return {
      summary: Array.from(groupedData.values()),
      details: detailedTransactions,
    };
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
        for (const item of sale.items as unknown as SaleItem[]) {
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
        for (const item of sale.items as unknown as SaleItem[]) {
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
}
