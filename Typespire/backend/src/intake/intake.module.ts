import { Module } from '@nestjs/common';
import { IntakeService } from './intake.service';
import { IntakeController } from './intake.controller';

@Module({
  controllers: [IntakeController],
  providers: [IntakeService],
})
export class IntakeModule {}
