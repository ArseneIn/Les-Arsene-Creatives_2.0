import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';

@Module({
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}
