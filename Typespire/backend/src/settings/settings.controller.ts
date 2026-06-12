import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { LogsService } from '../logs/logs.service';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly logsService: LogsService,
  ) {}

  @Get()
  @Roles(UserRole.PLATFORM_ADMIN)
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @Roles(UserRole.PLATFORM_ADMIN)
  async updateSettings(@Body() settings: any, @Request() req: any) {
    const res = await this.settingsService.updateSettings(settings);
    const actor = req.user;
    void this.logsService.log({
      action: 'SYSTEM_SETTINGS_UPDATED',
      category: 'SETTINGS',
      actorId: actor?.id,
      actorName: actor
        ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() ||
          actor.email
        : 'System',
      targetId: res.id,
      targetName: 'Global Benchmarks',
      severity: 'WARNING',
      metadata: settings,
    });
    return res;
  }
}
