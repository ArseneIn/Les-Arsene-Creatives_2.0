export class UpdateSettingsDto {
  platformName?: string;
  isMaintenanceMode?: boolean;
  maintenanceMessage?: string;
  maintenanceStartsAt?: Date;
}
