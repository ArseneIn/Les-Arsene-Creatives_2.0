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
import type { AuthenticatedUser } from '../auth/types';
import { CurrentUser } from '../auth/current-user.decorator';
import { Customer } from '../entities/customer.entity';

@Controller('client-management')
export class ClientManagementController {
  constructor(private readonly clientService: ClientManagementService) {}

  @UseGuards(JwtAuthGuard)
  @Post('debt')
  @HttpCode(HttpStatus.CREATED)
  async createDebtRecord(
    @Body() createDebtDto: CreateDebtRecordDto,
    @CurrentUser() user: AuthenticatedUser,
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

  @UseGuards(JwtAuthGuard)
  @Get('customers')
  async findAllCustomers(@CurrentUser() user: AuthenticatedUser) {
    return this.clientService.findAllCustomers(user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('customers')
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @Body() customerData: Partial<Customer>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user && user.merchantId) {
      customerData.merchant_id = user.merchantId;
    }
    return this.clientService.createCustomer(customerData);
  }
}
