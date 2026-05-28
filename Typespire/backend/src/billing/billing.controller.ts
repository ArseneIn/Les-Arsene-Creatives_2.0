import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BillingService, UpdateBillingDto } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get()
    getAllBilling() {
        return this.billingService.getAllBilling();
    }

    @Get('stats')
    getBillingStats() {
        return this.billingService.getBillingStats();
    }

    @Patch(':id')
    updateBilling(@Param('id') id: string, @Body() dto: UpdateBillingDto) {
        return this.billingService.updateBilling(id, dto);
    }
}
