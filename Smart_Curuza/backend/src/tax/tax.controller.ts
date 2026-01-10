import { Controller, Get, Query } from '@nestjs/common';
import { TaxService } from './tax.service';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('liability-status')
  getLiabilityStatus(@Query('merchantId') merchantId: string) {
    return this.taxService.getLiabilityStatus(merchantId);
  }
}
