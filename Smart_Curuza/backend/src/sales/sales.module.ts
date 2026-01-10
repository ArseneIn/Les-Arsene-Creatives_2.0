import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { ClientManagementModule } from '../client-management/client-management.module';
import { ClientManagementService } from '../client-management/client-management.service';

import { BatchesModule } from '../batches/batches.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product]),
    ClientManagementModule,
    BatchesModule,
    NotificationsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
