import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientManagementController } from './client-management.controller';
import { ClientManagementService } from './client-management.service';
import { SmsGateway } from '../shared/interfaces/sms-gateway.interface';
import { Customer } from '../entities/customer.entity';
import { DebtLedger } from '../entities/debt-ledger.entity';

// Mock SMS Gateway for Development
class MockSmsGateway implements SmsGateway {
  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    console.log(`[MockSmsGateway] Sending SMS to ${phoneNumber}: ${message}`);
    return true;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Customer, DebtLedger])],
  controllers: [ClientManagementController],
  providers: [
    ClientManagementService,
    { provide: 'SMS_GATEWAY', useClass: MockSmsGateway },
  ],
  exports: [ClientManagementService],
})
export class ClientManagementModule {}
