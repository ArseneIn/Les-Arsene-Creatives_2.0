import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';
import { Merchant } from '../entities/merchant.entity';
import { User } from '../entities/user.entity';
import { Shift } from '../entities/shift.entity';
import { Sale } from '../entities/sale.entity';

import { NotificationsModule } from '../notifications/notifications.module';

import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant, User, Shift, Sale]),
    NotificationsModule,
  ],
  controllers: [MerchantsController, StaffController, ShiftsController],
  providers: [MerchantsService, StaffService, ShiftsService],
  exports: [MerchantsService, StaffService, ShiftsService],
})
export class MerchantsModule { }
