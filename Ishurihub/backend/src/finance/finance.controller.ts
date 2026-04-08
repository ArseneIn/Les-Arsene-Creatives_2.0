import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeatureGuard } from '../auth/guards/feature.guard';
import { RequireFeature } from '../auth/decorators/require-feature.decorator';
import { Feature } from '../subscriptions/enums/feature.enum';

@Controller('finance/payments')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(Feature.FINANCE)
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
