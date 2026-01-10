import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EbmController } from './ebm.controller';
import { EbmService } from './ebm.service';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { Merchant } from '../entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product, Merchant])],
  controllers: [EbmController],
  providers: [EbmService],
  exports: [EbmService],
})
export class EbmModule {}
