import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

import { CreateStaffDto } from './dto/create-staff.dto';
import type { AuthenticatedUser } from '../auth/types';

@Controller('merchants/staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {
  }

  @Get()
  async getStaff(@CurrentUser() user: AuthenticatedUser) {
    return this.staffService.getStaff(user.merchantId);
  }

  @Post()
  async createStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateStaffDto,
  ) {
    return this.staffService.createStaff(user.merchantId, body);
  }

  @Delete(':id')
  async removeStaff(@Param('id') id: string) {
    return this.staffService.removeStaff(id);
  }

  @Get(':id/activity')
  async getStaffActivity(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.staffService.getStaffActivity(user.merchantId, id);
  }
}
