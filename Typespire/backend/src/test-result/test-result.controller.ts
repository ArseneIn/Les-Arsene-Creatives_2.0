import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TestResultService } from './test-result.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('test-result')
@UseGuards(JwtAuthGuard)
export class TestResultController {
  constructor(private readonly testResultService: TestResultService) {}

  @Post()
  async create(
    @Request() req,
    @Body()
    body: {
      wpm: number;
      accuracy: number;
      duration: number;
      strugglingKeys?: Record<string, number>;
      testId: string;
      assignmentId?: string;
    },
  ) {
    return this.testResultService.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @Get('student/:userId')
  async findByStudent(@Param('userId') userId: string) {
    return this.testResultService.findByStudent(userId);
  }

  @Get('assignment/:assignmentId')
  async findByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.testResultService.findByAssignment(assignmentId);
  }

  @Get('institution/:institutionId')
  async findByInstitution(@Param('institutionId') institutionId: string) {
    return this.testResultService.findByInstitution(institutionId);
  }

  @Get('section/:sectionId')
  async findBySection(@Param('sectionId') sectionId: string) {
    return this.testResultService.findBySection(sectionId);
  }
}
