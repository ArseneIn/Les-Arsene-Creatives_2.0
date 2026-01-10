import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('merchants/shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Post('open')
    async openShift(
        @CurrentUser() user: any,
        @Body('startingCash') startingCash: number,
    ) {
        return this.shiftsService.openShift(user.userId, user.merchantId, startingCash);
    }

    @Patch('close/:id')
    async closeShift(
        @Param('id') id: string,
        @Body('actualCash') actualCash: number,
        @Body('notes') notes?: string,
    ) {
        return this.shiftsService.closeShift(id, actualCash, notes);
    }

    @Get('current')
    async getCurrentShift(@CurrentUser() user: any) {
        return this.shiftsService.getCurrentShift(user.userId);
    }

    @Get('history')
    async getMerchantShifts(@CurrentUser() user: any) {
        return this.shiftsService.getMerchantShifts(user.merchantId);
    }
}
