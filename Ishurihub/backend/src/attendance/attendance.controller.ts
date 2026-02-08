import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId: string, @Query('date') date?: string) {
    return this.attendanceService.findAll(schoolId, date);
  }

  @Get('stats')
  getStats(@Query('schoolId') schoolId: string) {
    return this.attendanceService.getStats(schoolId);
  }

  @Get('trends/weekly')
  getWeeklyTrends(@Query('schoolId') schoolId: string) {
    return this.attendanceService.getWeeklyTrends(schoolId);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }
}
