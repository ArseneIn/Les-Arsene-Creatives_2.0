import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { EbmService } from './ebm.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ebm')
// @UseGuards(JwtAuthGuard)
export class EbmController {
  constructor(private readonly ebmService: EbmService) {}

  @Get('codes')
  getCodes() {
    return this.ebmService.fetchCodes();
  }

  @Post('init/:merchantId')
  initialize(@Param('merchantId') merchantId: string) {
    return this.ebmService.initialize(merchantId);
  }

  @Post('sync/:saleId')
  syncSale(@Param('saleId') saleId: string) {
    return this.ebmService.submitSale(saleId);
  }
}
