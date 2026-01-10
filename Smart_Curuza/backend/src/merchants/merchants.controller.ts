import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MerchantsService } from './merchants.service';
import { Merchant } from '../entities/merchant.entity';

@Controller('merchants')
@UseGuards(AuthGuard('jwt'))
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.merchantsService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: Partial<Merchant>) {
    return this.merchantsService.updateProfile(req.user.id, updateData);
  }
}
