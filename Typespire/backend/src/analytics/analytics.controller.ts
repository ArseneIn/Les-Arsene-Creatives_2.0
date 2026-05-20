import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @Roles(UserRole.PLATFORM_ADMIN)
  getGlobalStats() {
    return this.analyticsService.getGlobalStats();
  }

  @Get('facilitator/:facilitatorId')
  // We can let Facilitators and Admins see this
  @Roles(
    UserRole.PLATFORM_ADMIN,
    UserRole.INSTITUTION_ADMIN,
    UserRole.FACILITATOR,
  )
  getFacilitatorStats(@Param('facilitatorId') facilitatorId: string) {
    return this.analyticsService.getFacilitatorStats(facilitatorId);
  }
}
