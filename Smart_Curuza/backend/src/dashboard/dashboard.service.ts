import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { ProductsService } from '../products/products.service';
import { ClientManagementService } from '../client-management/client-management.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
    private readonly clientService: ClientManagementService,
  ) { }

  async getDashboardStats(merchantId: string, period: string = 'today') {
    const now = new Date();
    let startDate: string;
    const endDate = now.toISOString().split('T')[0];

    if (period === 'week') {
      const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // Past 7 days
      startDate = start.toISOString().split('T')[0];
    } else if (period === 'month') {
      const start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000); // Past 30 days
      startDate = start.toISOString().split('T')[0];
    } else {
      startDate = endDate; // Today
    }

    // 1. Sales & Profit
    const salesReport = await this.salesService.getSalesReport(
      startDate,
      endDate,
      merchantId,
    );
    
    // Aggregating array since getSalesReport returns partitioned stats per day
    const aggregatedStats = salesReport.reduce(
      (acc, day) => {
        acc.revenue += day.revenue;
        acc.profit += day.profit;
        acc.count += day.count;
        acc.vat += day.vat;
        return acc;
      },
      { revenue: 0, profit: 0, count: 0, vat: 0 },
    );

    // 2. Low Stock Count
    const products = await this.productsService.findAll(merchantId);
    const lowStockCount = products.filter((p: any) => p.stock < 10).length; // Threshold 10

    // 3. Outstanding Debt
    const customers = await this.clientService.findAllCustomers(merchantId);
    const totalDebt = customers.reduce(
      (sum, c) => sum + (Number(c.total_debt) || 0),
      0,
    );

    // 4. Yield Rate (Profit Margin)
    const margin =
      aggregatedStats.revenue > 0
        ? (aggregatedStats.profit / aggregatedStats.revenue) * 100
        : 0;

    return {
      todaySales: aggregatedStats.revenue,
      todayProfit: aggregatedStats.profit,
      todayTransactionCount: aggregatedStats.count,
      todayVat: aggregatedStats.vat,
      lowStockCount,
      totalDebt,
      yieldRate: margin,
    };
  }

  async getRecentTransactions(merchantId: string) {
    return this.salesService.getRecentSales(5, merchantId);
  }

  async getLowStockProducts(merchantId: string) {
    const products = await this.productsService.findAll(merchantId);
    return products
      .filter((p: any) => p.stock < 10)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        unit: p.unit,
        min: 10, // Hardcoded threshold for now
        critical: p.stock < 5,
      }));
  }
}
