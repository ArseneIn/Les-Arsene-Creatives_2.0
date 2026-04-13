import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PocketMoneyService } from './pocket-money.service';
import { PocketMoneyController } from './pocket-money.controller';
import { PocketMoneyAccount } from './entities/pocket-money-account.entity';
import { PocketMoneyTransaction } from './entities/pocket-money-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PocketMoneyAccount, PocketMoneyTransaction]),
  ],
  controllers: [PocketMoneyController],
  providers: [PocketMoneyService],
  exports: [PocketMoneyService],
})
export class PocketMoneyModule {}
