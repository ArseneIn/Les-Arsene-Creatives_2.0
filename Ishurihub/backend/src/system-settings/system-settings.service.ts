import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettings } from './entities/system-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SystemSettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SystemSettings)
    private settingsRepository: Repository<SystemSettings>,
  ) {}

  async onModuleInit() {
    // Ensure there is at least one settings row
    const count = await this.settingsRepository.count();
    if (count === 0) {
      await this.settingsRepository.save(
        this.settingsRepository.create({
          id: 1,
          platformName: 'IshuriHub',
          isMaintenanceMode: false,
        }),
      );
    }
  }

  async getSettings(): Promise<SystemSettings | null> {
    return this.settingsRepository.findOneBy({ id: 1 });
  }

  async updateSettings(
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<SystemSettings | null> {
    await this.settingsRepository.update(1, updateSettingsDto);
    return this.getSettings();
  }

  async isMaintenanceMode(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings?.isMaintenanceMode || false;
  }
}
