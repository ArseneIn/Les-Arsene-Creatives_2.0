import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('merchants/shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Get('current')
    getCurrentShift(@CurrentUser() user: User) {
        return this.shiftsService.getCurrentShift(user.id);
    }

    @Get('history')
    getShiftHistory(@CurrentUser() user: User) {
        return this.shiftsService.getShiftHistory(user.id);
    }

    @Post('open')
    openShift(
        @CurrentUser() user: User,
        @Body('startingCash') startingCash: number,
    ) {
        return this.shiftsService.openShift(user.id, startingCash);
    }

    @Patch('close/:id')
    closeShift(
        @Param('id') id: string,
        @Body() body: { actualCash: number; notes?: string },
    ) {
        return this.shiftsService.closeShift(id, body.actualCash, body.notes);
    }
}
