import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('finance/payments')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.financeService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId: string) {
    return this.financeService.findAll(schoolId);
  }

  @Get('stats/monthly')
  getMonthlyStats(@Query('schoolId') schoolId: string) {
    return this.financeService.getMonthlyStats(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
