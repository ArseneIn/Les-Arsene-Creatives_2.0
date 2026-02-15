import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import {
  SchoolEvent,
  EventType,
  TargetAudience,
} from './entities/school-event.entity';
import {
  EventOccurrence,
  OccurrenceStatus,
} from './entities/event-occurrence.entity';
import {
  EventAttendance,
  AttendanceStatus,
} from './entities/event-attendance.entity';
import { CreateEventDto } from './dto/create-event.dto'; // We will create this DTO
import { CreateAttendanceDto } from './dto/create-attendance.dto'; // We will create this DTO
import { startOfDay, endOfDay, addDays, isSameDay } from 'date-fns';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(SchoolEvent)
    private eventsRepository: Repository<SchoolEvent>,
    @InjectRepository(EventOccurrence)
    private occurrencesRepository: Repository<EventOccurrence>,
    @InjectRepository(EventAttendance)
    private attendanceRepository: Repository<EventAttendance>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    schoolId: string,
  ): Promise<SchoolEvent> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      schoolId,
    });

    const savedEvent = await this.eventsRepository.save(event);

    if (savedEvent.isRecurring && savedEvent.startDate && savedEvent.endDate) {
      await this.generateOccurrences(savedEvent);
    } else if (savedEvent.startDate) {
      // Single occurrence
      await this.createSingleOccurrence(savedEvent, savedEvent.startDate);
    }

    return savedEvent;
  }

  private async createSingleOccurrence(event: SchoolEvent, date: string) {
    const occurrence = this.occurrencesRepository.create({
      event,
      date,
      startTime: event.startTime,
      endTime: event.endTime,
      status: OccurrenceStatus.SCHEDULED,
    });
    await this.occurrencesRepository.save(occurrence);
  }

  private async generateOccurrences(event: SchoolEvent) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const pattern = event.recurrencePattern; // e.g., { type: 'WEEKLY', days: [1, 5] } (1=Mon, 5=Fri)

    let current = start;

    while (current <= end) {
      // Check if current day matches pattern
      if (this.matchesPattern(current, pattern)) {
        await this.createSingleOccurrence(
          event,
          current.toISOString().split('T')[0],
        );
      }
      current = addDays(current, 1);
    }
  }

  private matchesPattern(date: Date, pattern: any): boolean {
    if (!pattern) return true; // Default to daily if no pattern? Or handle differently.

    if (pattern.type === 'DAILY') return true;

    if (pattern.type === 'WEEKLY' && pattern.days) {
      const dayOfWeek = date.getDay(); // 0-6 (Sun-Sat)
      // Adjust if pattern days use 1-7 or 0-6. Let's assume 0-6 for simplicity in backend logic
      return pattern.days.includes(dayOfWeek);
    }

    return false;
  }

  async findAll(schoolId: string): Promise<SchoolEvent[]> {
    return this.eventsRepository.find({
      where: { schoolId },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SchoolEvent> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['occurrences'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findOccurrences(eventId: string): Promise<EventOccurrence[]> {
    return this.occurrencesRepository.find({
      where: { eventId },
      order: { date: 'ASC' },
      relations: ['attendances'],
    });
  }

  async recordAttendance(
    occurrenceId: string,
    createAttendanceDto: CreateAttendanceDto,
    recordedById: string,
  ): Promise<EventAttendance> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id: occurrenceId },
    });
    if (!occurrence) throw new NotFoundException('Occurrence not found');

    let attendance = await this.attendanceRepository.findOne({
      where: {
        occurrenceId,
        studentId: createAttendanceDto.studentId,
      },
    });

    if (attendance) {
      // Update existing
      attendance.status = createAttendanceDto.status;
      attendance.checkInTime = new Date();
      attendance.recordedById = recordedById;
    } else {
      // Create new
      attendance = this.attendanceRepository.create({
        occurrenceId,
        studentId: createAttendanceDto.studentId,
        status: createAttendanceDto.status,
        checkInTime: new Date(),
        recordedById,
      });
    }

    return this.attendanceRepository.save(attendance);
  }
}
