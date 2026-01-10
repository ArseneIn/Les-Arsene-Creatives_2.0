import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getDashboardStats(user.merchantId);
  }

  @Get('recent-transactions')
  async getRecentTransactions(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getRecentTransactions(user.merchantId);
  }

  @Get('low-stock')
  async getLowStock(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getLowStockProducts(user.merchantId);
  }
}
