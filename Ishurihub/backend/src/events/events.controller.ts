import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Request() req: AuthenticatedRequest, @Body() createEventDto: CreateEventDto) {
    // Assuming user has schoolId, or we pass it in body. 
    // Usually admin user belongs to a school.
    const schoolId = req.user.schoolId;
    return this.eventsService.create(createEventDto, schoolId);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const schoolId = req.user.schoolId;
    return this.eventsService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get(':id/occurrences')
  getOccurrences(@Param('id') id: string) {
    return this.eventsService.findOccurrences(id);
  }

  @Post('occurrences/:id/attendance')
  @Roles('ADMIN', 'TEACHER', 'SUPER_ADMIN')
  recordAttendance(
    @Param('id') occurrenceId: string,
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.eventsService.recordAttendance(
      occurrenceId,
      createAttendanceDto,
      req.user.id,
    );
  }
}
