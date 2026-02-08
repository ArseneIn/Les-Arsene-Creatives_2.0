import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableEventDto } from './dto/create-timetable-event.dto';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  create(@Body() createDto: CreateTimetableEventDto) {
    return this.timetableService.create(createDto);
  }

  @Get()
  findAll(
    @Query('schoolId') schoolId: string,
    @Query('classId') classId?: string,
  ) {
    return this.timetableService.findAll(schoolId, classId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
