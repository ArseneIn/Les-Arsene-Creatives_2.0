import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { ProductsService } from '../products/products.service';
import { ClientManagementService } from '../client-management/client-management.service';
import { ExpensesService } from '../expenses/expenses.service';

// ---------------------------------------------------------------------------
// Local helper types – keep the unsafe casts concentrated here, not spread
// across the service methods.
// ---------------------------------------------------------------------------
interface DayReport {
  revenue: number;
  profit: number;
  count: number;
  vat: number;
}

interface RawProduct {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

interface RawCustomer {
  total_debt: number;
}

interface RawExpenseSummary {
  total: number;
}

interface TopSellingRow {
  id: string;
  name: string;
  sold_quantity: string;
  price: string;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly salesService: SalesService,
    private readonly productsService: ProductsService,
    private readonly clientService: ClientManagementService,
    private readonly expensesService: ExpensesService,
  ) {}

  async getDashboardStats(merchantId: string, period: string = 'today') {
    // Normalize to Kigali Time (UTC+2)
    const kigaliNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    let startDate: string;
    const endDate = kigaliNow.toISOString().split('T')[0];

    if (period === 'week') {
      const start = new Date(kigaliNow.getTime() - 6 * 24 * 60 * 60 * 1000);
      startDate = start.toISOString().split('T')[0];
    } else if (period === 'month') {
      const start = new Date(kigaliNow.getTime() - 29 * 24 * 60 * 60 * 1000);
      startDate = start.toISOString().split('T')[0];
    } else {
      startDate = endDate;
    }

    // 1. Sales & Profit
    const salesReport = (await this.salesService.getSalesReport(
      startDate,
      endDate,
      merchantId,
    )) as DayReport[];

    const aggregatedStats = salesReport.reduce(
      (acc, day) => {
        acc.revenue += Number(day.revenue) || 0;
        acc.profit += Number(day.profit) || 0;
        acc.count += Number(day.count) || 0;
        acc.vat += Number(day.vat) || 0;
        return acc;
      },
      { revenue: 0, profit: 0, count: 0, vat: 0 },
    );

    // 2. Low Stock Count
    const products = (await this.productsService.findAll(
      merchantId,
    )) as RawProduct[];
    const lowStockCount = products.filter((p) => Number(p.stock) < 10).length;

    // 3. Outstanding Debt
    const customers = (await this.clientService.findAllCustomers(
      merchantId,
    )) as RawCustomer[];
    const totalDebt = customers.reduce(
      (sum, c) => sum + (Number(c.total_debt) || 0),
      0,
    );

    // 4. Expenses
    const expenseSummary = (await this.expensesService.getSummary(
      merchantId,
      startDate,
      endDate,
    )) as RawExpenseSummary;
    const totalExpenses = Number(expenseSummary.total) || 0;

    // 5. Yield Rate (Net Profit Margin)
    const netProfit = aggregatedStats.profit - totalExpenses;
    const margin =
      aggregatedStats.revenue > 0
        ? (netProfit / aggregatedStats.revenue) * 100
        : 0;

    // 6. Top Selling Products
    const topSellingProducts = await this.getTopSellingProducts(
      merchantId,
      startDate,
      endDate,
    );

    return {
      todaySales: aggregatedStats.revenue,
      todayProfit: netProfit,
      todayGrossProfit: aggregatedStats.profit,
      todayExpenses: totalExpenses,
      todayTransactionCount: aggregatedStats.count,
      todayVat: aggregatedStats.vat,
      lowStockCount,
      totalDebt,
      yieldRate: margin,
      topSellingProducts,
    };
  }

  /**
   * Aggregates sale items within the given date range using PostgreSQL JSONB functions.
   * Returns the top 5 products ranked by total revenue in that period.
   */
  async getTopSellingProducts(
    merchantId: string,
    startDate: string,
    endDate: string,
  ): Promise<
    Array<{ id: string; name: string; sold_quantity: number; price: number }>
  > {
    // Boundaries adjusted for Kigali (UTC+2)
    // 00:00:00 Kigali = 22:00:00 UTC (previous day)
    const start = new Date(startDate);
    start.setHours(start.getHours() - 2);
    
    const end = new Date(endDate);
    end.setHours(23 - 2, 59, 59, 999);

    // Using raw query for high-performance JSONB aggregation
    const results = (await this.salesService.getRawQuery(
      `
      SELECT 
        item->>'id' as id, 
        MAX(item->>'name') as name, 
        SUM((item->>'quantity')::numeric) as sold_quantity,
        AVG((item->>'price')::numeric) as price
      FROM sales, jsonb_array_elements(items) as item
      WHERE merchant_id = $1 
        AND created_at BETWEEN $2 AND $3
        AND status != 'REFUNDED'
      GROUP BY item->>'id'
      ORDER BY sold_quantity DESC
      LIMIT 5
    `,
      [merchantId, start, end],
    )) as TopSellingRow[];

    return results.map((row) => ({
      id: row.id,
      name: row.name,
      sold_quantity: parseFloat(row.sold_quantity) || 0,
      price: parseFloat(row.price) || 0,
    }));
  }

  async getRecentTransactions(merchantId: string) {
    return this.salesService.getRecentSales(5, merchantId);
  }

  async getLowStockProducts(merchantId: string) {
    const products = (await this.productsService.findAll(
      merchantId,
    )) as RawProduct[];
    return products
      .filter((p) => Number(p.stock) < 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: Number(p.stock),
        unit: p.unit,
        min: 10,
        critical: Number(p.stock) < 5,
      }));
  }
}
