import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  getStats() {
    return this.superAdminService.getStats();
  }

  @Get('activity')
  getActivity() {
    return this.superAdminService.getActivity();
  }

  @Get('alerts')
  getAlerts() {
    return this.superAdminService.getAlerts();
  }

  @Get('merchants')
  getMerchants() {
    return this.superAdminService.getMerchants();
  }

  @Post('merchants/:id/subscription')
  updateSubscription(
    @Param('id') id: string,
    @Body()
    body: { status: 'ACTIVE' | 'INACTIVE' | 'TRIAL'; expiryDate?: string },
  ) {
    return this.superAdminService.updateSubscription(
      id,
      body.status,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
    );
  }
  @Post('merchants/:id/toggle-lock')
  toggleLock(@Param('id') id: string) {
    return this.superAdminService.toggleLock(id);
  }
}
