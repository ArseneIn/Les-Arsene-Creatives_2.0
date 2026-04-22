import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SalesModule } from '../sales/sales.module';
import { ProductsModule } from '../products/products.module';
import { ClientManagementModule } from '../client-management/client-management.module';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    SalesModule,
    ProductsModule,
    ClientManagementModule,
    ExpensesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
