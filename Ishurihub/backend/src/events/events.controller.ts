import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
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
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createEventDto: CreateEventDto,
  ) {
    // If Super Admin provides a schoolId in the body, use it.
    // Otherwise, fallback to the user's assigned schoolId.
    const userRole = req.user.role;
    const isSuperAdmin =
      userRole === 'super_admin' ||
      (typeof userRole === 'object' && userRole.id === 'super_admin');

    const schoolId =
      isSuperAdmin && createEventDto.schoolId
        ? createEventDto.schoolId
        : req.user.schoolId;

    return this.eventsService.create(createEventDto, schoolId);
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('schoolId') querySchoolId?: string,
  ) {
    console.log('EventsController.findAll called');
    console.log('User:', req.user);
    console.log('Query SchoolId:', querySchoolId);

    // If Super Admin provides a schoolId, use it.
    // Otherwise, fallback to the user's assigned schoolId.
    const userRole = req.user.role;
    const isSuperAdmin =
      userRole === 'super_admin' ||
      (typeof userRole === 'object' && userRole.id === 'super_admin');

    const schoolId =
      isSuperAdmin && querySchoolId ? querySchoolId : req.user.schoolId;

    if (!schoolId || schoolId === 'undefined') {
      throw new BadRequestException('Invalid or missing School ID');
    }

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
