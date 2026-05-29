import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}
