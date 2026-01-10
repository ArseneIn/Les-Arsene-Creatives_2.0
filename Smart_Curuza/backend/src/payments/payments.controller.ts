import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stk-push')
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiateStkPush(dto);
  }
}
