import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableEventDto } from './dto/create-timetable-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeatureGuard } from '../auth/guards/feature.guard';
import { RequireFeature } from '../auth/decorators/require-feature.decorator';
import { Feature } from '../subscriptions/enums/feature.enum';

@Controller('timetable')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(Feature.TIMETABLE)
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
