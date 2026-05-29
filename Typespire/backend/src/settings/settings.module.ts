import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { RequirementsController } from './requirements.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [SettingsController, RequirementsController],
  providers: [SettingsService],
})
export class SettingsModule {}
