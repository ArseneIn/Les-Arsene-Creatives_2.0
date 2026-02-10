import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SchoolEvent } from './entities/school-event.entity';
import { EventOccurrence } from './entities/event-occurrence.entity';
import { EventAttendance } from './entities/event-attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SchoolEvent, EventOccurrence, EventAttendance]),
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule { }
