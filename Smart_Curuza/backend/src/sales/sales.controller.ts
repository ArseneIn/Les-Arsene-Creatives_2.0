import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  private readonly logger = new Logger(SalesController.name);

  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.findAll(user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async getRecent(
    @Query('limit') limit: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getRecentSales(
      limit ? parseInt(limit, 10) : 5,
      user.merchantId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('report')
  async getReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getSalesReport(
      startDate,
      endDate,
      user.merchantId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('staff-report')
  async getStaffReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getSalesByStaff(
      startDate,
      endDate,
      user.merchantId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('export')
  async exportSales(
    @Query('period') period: 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.salesService.getExportData(period, user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category-report')
  async getCategoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getSalesByCategory(
      startDate,
      endDate,
      user.merchantId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('product-report')
  async getProductReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getSalesByProduct(
      startDate,
      endDate,
      user.merchantId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/:id')
  async getByCustomer(
    @Param('id') customerId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.getSalesByCustomer(customerId, user.merchantId);
  }

  @Post('cleanup')
  async cleanupNegativeSales() {
    const count = await this.salesService.deleteNegativeProfitSales();
    return { message: `Deleted ${count} transactions with negative profit.` };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSale(
    @Body() saleData: CreateSaleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Automatically set merchantId and userId from the authenticated user
    if (user) {
      saleData.merchantId = user.merchantId;
      saleData.userId = user.userId;
    }
    return this.salesService.createSale(saleData);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/refund')
  async refundSale(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('restock') restock: boolean,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.salesService.refundSale(id, reason, restock, user.merchantId);
  }
}
