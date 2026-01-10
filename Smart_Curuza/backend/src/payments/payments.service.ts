import { Injectable, Logger } from '@nestjs/common';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  async initiateStkPush(dto: InitiatePaymentDto) {
    this.logger.log(
      `Initiating STK Push for ${dto.phoneNumber} amount ${dto.amount}`,
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      status: 'pending', // In real life this is pending until webhook
      message: 'Payment request sent to device',
    };
  }
}
