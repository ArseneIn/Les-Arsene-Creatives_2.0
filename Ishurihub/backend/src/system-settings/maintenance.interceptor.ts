import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { SystemSettingsService } from './system-settings.service';

@Injectable()
export class MaintenanceInterceptor implements NestInterceptor {
  constructor(private readonly settingsService: SystemSettingsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const settings = await this.settingsService.getSettings();
    const isMaintenance = settings?.isMaintenanceMode || false;
    const maintenanceStartsAt = settings?.maintenanceStartsAt;

    const response = context.switchToHttp().getResponse<Response>();

    // Inject maintenance headers into every response
    if (isMaintenance) {
      response.setHeader('X-Maintenance-Mode', 'true');
    }

    if (maintenanceStartsAt) {
      response.setHeader(
        'X-Maintenance-Starts-At',
        maintenanceStartsAt.toISOString(),
      );
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
