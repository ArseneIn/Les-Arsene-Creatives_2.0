import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ClientManagementService } from './client-management.service';
import { CreateDebtRecordDto } from './dto/create-debt.dto';
import { SendReminderDto } from './dto/send-reminder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('client-management')
export class ClientManagementController {
  constructor(private readonly clientService: ClientManagementService) { }

  @UseGuards(JwtAuthGuard)
  @Post('debt')
  @HttpCode(HttpStatus.CREATED)
  async createDebtRecord(
    @Body() createDebtDto: CreateDebtRecordDto,
    @CurrentUser() user: any,
  ) {
    if (user && user.merchantId) {
      createDebtDto.merchantId = user.merchantId;
    }
    return this.clientService.createDebtRecord(createDebtDto);
  }

  @Post('remind/:customerId')
  @HttpCode(HttpStatus.OK)
  async sendSmsReminder(
    @Param('customerId') customerId: string,
    @Body() reminderDto: SendReminderDto,
  ) {
    return this.clientService.sendSmsReminder(customerId, reminderDto.shopName);
  }

  @Get('customers')
  async findAllCustomers() {
    return this.clientService.findAllCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('customers')
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() customerData: any, @CurrentUser() user: any) {
    if (user && user.merchantId) {
      customerData.merchant_id = user.merchantId;
    }
    return this.clientService.createCustomer(customerData);
  }
}
