import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HolidayLmsService } from './holiday-lms.service';
import { CompleteActivityDto } from './dto/complete-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeatureGuard } from '../auth/guards/feature.guard';
import { RequireFeature } from '../auth/decorators/require-feature.decorator';
import { Feature } from '../subscriptions/enums/feature.enum';

@Controller('holiday-lms')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(Feature.HOLIDAY_LMS)
export class HolidayLmsController {
  constructor(private readonly lmsService: HolidayLmsService) {}

  @Get('courses')
  async getCourses(@Request() req, @Query('grade') grade: string) {
    const schoolId = req.user.schoolId;
    return this.lmsService.findAllCourses(schoolId, grade);
  }

  @Get('courses/:id')
  async getCourseDetails(@Param('id') id: string, @Request() req) {
    const studentId = req.user.id; // Corrected: Using user id as student identifier for mapping
    return this.lmsService.findCourseDetails(id, studentId);
  }

  @Get('activities/:id')
  async getActivity(@Param('id') id: string, @Request() req) {
    const studentId = req.user.id;
    return this.lmsService.findActivity(id, studentId);
  }

  @Post('activities/complete')
  async completeActivity(@Request() req, @Body() dto: CompleteActivityDto) {
    const studentId = req.user.id;
    return this.lmsService.completeActivity(studentId, dto);
  }
}
