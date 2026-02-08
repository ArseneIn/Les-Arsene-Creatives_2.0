import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTimetableEventDto } from './dto/create-timetable-event.dto';
import { TimetableEvent } from './entities/timetable-event.entity';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(TimetableEvent)
    private timetableRepository: Repository<TimetableEvent>,
  ) {}

  create(createDto: CreateTimetableEventDto) {
    const event = this.timetableRepository.create(createDto);
    return this.timetableRepository.save(event);
  }

  findAll(schoolId: string, classId?: string) {
    const where: any = { schoolId };
    if (classId) {
      where.classId = classId;
    }
    return this.timetableRepository.find({ where });
  }

  findOne(id: string) {
    return this.timetableRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.timetableRepository.delete(id);
  }
}
