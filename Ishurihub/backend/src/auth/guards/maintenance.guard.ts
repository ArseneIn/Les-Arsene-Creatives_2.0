import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SystemSettingsService } from '../../system-settings/system-settings.service';

interface RequestUser {
  roleId?: string;
  role?: string;
}

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private readonly settingsService: SystemSettingsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isMaintenance = await this.settingsService.isMaintenanceMode();
    if (!isMaintenance) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Bypass for Login route so Super Admin can still log in to turn it off
    if (request.url.includes('/auth/login')) {
      return true;
    }

    // Bypass for Super Admin
    const user = request.user as RequestUser | undefined;

    if (
      user &&
      (user.roleId === 'super_admin' || user.role === 'super_admin')
    ) {
      return true;
    }

    throw new ServiceUnavailableException('System is under maintenance');
  }
}
