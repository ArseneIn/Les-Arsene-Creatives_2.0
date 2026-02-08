import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TimetableEvent } from './entities/timetable-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimetableEvent])],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {}
