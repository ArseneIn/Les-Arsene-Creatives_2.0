import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BillingService, UpdateBillingDto } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { LogsService } from '../logs/logs.service';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly logsService: LogsService,
  ) {}

  @Get()
  getAllBilling() {
    return this.billingService.getAllBilling();
  }

  @Get('stats')
  getBillingStats() {
    return this.billingService.getBillingStats();
  }

  @Patch(':id')
  async updateBilling(
    @Param('id') id: string,
    @Body() dto: UpdateBillingDto,
    @Request() req: any,
  ) {
    const res = await this.billingService.updateBilling(id, dto);
    const actor = req.user;
    void this.logsService.log({
      action: 'BILLING_PLAN_UPDATED',
      category: 'BILLING',
      actorId: actor?.id,
      actorName: actor
        ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() ||
          actor.email
        : 'System',
      targetId: res.id,
      targetName: res.name,
      severity: 'INFO',
      metadata: {
        newPlan: res.plan,
        status: res.subscriptionStatus,
        maxStudents: res.maxStudents,
      },
    });
    return res;
  }
}
