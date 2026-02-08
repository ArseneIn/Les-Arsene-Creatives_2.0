import { Injectable } from '@nestjs/common';
// Service for managing system-wide settings
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSettings.findFirst();
    if (!settings) {
      // Create default settings if not found
      settings = await this.prisma.systemSettings.create({
        data: {},
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    return this.prisma.systemSettings.update({
      where: { id: settings.id },
      data,
    });
  }
}
