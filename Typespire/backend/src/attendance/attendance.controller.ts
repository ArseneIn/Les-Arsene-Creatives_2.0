import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async bulkSave(
    @Body()
    body: {
      sectionId: string;
      date: string;
      records: { studentId: string; status: string }[];
    },
    @Request() req: any,
  ) {
    const recordedById = req.user?.id;
    return this.attendanceService.bulkSave(
      body.sectionId,
      body.date,
      body.records,
      recordedById,
    );
  }

  @Get('section/:sectionId/date/:date')
  async findForSectionAndDate(
    @Param('sectionId') sectionId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.findForSectionAndDate(sectionId, date);
  }
}
