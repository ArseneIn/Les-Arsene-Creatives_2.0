import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_ADMIN')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('severity') severity?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.logsService.findAll({
            category,
            severity,
            limit: limit ? parseInt(limit, 10) : 50,
            offset: offset ? parseInt(offset, 10) : 0,
        });
    }
}
