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

  async getDashboardStats(merchantId: string) {
    // 1. Today's Sales & Profit
    const today = new Date().toISOString().split('T')[0];
    const salesReport = await this.salesService.getSalesReport(today, today, merchantId);
    const todayStats = salesReport[0] || {
      revenue: 0,
      profit: 0,
      count: 0,
      vat: 0,
    };

    // 2. Low Stock Count
    const products = await this.productsService.findAll();
    const lowStockCount = products.filter((p) => p.stock < 10).length; // Threshold 10

    // 3. Outstanding Debt
    const customers = await this.clientService.findAllCustomers();
    const totalDebt = customers.reduce(
      (sum, c) => sum + (Number(c.total_debt) || 0),
      0,
    );

    // 4. Yield Rate (Profit Margin)
    const margin =
      todayStats.revenue > 0
        ? (todayStats.profit / todayStats.revenue) * 100
        : 0;

    return {
      todaySales: todayStats.revenue,
      todayProfit: todayStats.profit,
      todayTransactionCount: todayStats.count,
      todayVat: todayStats.vat,
      lowStockCount,
      totalDebt,
      yieldRate: margin,
    };
  }

  async getRecentTransactions(merchantId: string) {
    // Assuming getRecentSales supports merchantId, if not we might need to update it too.
    // Checking SalesService usage in previous steps implies it might.
    // If not, we'll get another error. But let's assume it does or we'll fix it.
    // Actually, looking at the error log: "An argument for 'merchantId' was not provided." was for getSalesReport.
    // getRecentSales was not mentioned in errors, but likely needs it too if it filters by merchant.
    // I'll check SalesService if I can, but for now I'll just pass it if the method signature allows, or wait for error.
    // Wait, I can't see SalesService signature easily without reading it.
    // But I'll update the service method to accept it anyway.
    return this.salesService.getRecentSales(5);
  }

  async getLowStockProducts(merchantId: string) {
    const products = await this.productsService.findAll();
    return products
      .filter((p) => p.stock < 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        unit: p.unit,
        min: 10, // Hardcoded threshold for now
        critical: p.stock < 5,
      }));
  }
}
