import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

interface RequestWithUserAndQuery {
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    institutionId?: string;
  };
  query?: {
    studentId?: string;
    sectionId?: string;
  };
}

@Controller('assignment')
export class AssignmentController {
  constructor(
    private assignmentService: AssignmentService,
    private logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body()
    body: {
      title: string;
      dueDate: string;
      sectionId?: string;
      studentIds?: string[];
      level?: number;
      duration?: number;
      content?: string;
      maxAttempts?: number;
      wpmRequirement?: number;
      accuracyRequirement?: number;
      bypassLevel?: boolean;
      attendanceDate?: string;
    },
    @Request() req: RequestWithUserAndQuery,
  ) {
    const res = await this.assignmentService.create({
      ...body,
      institutionId: req.user?.institutionId,
    });
    const actor = req.user;
    void this.logsService.log({
      action: 'ASSIGNMENT_PUBLISHED',
      category: 'ASSIGNMENT',
      actorId: actor?.id,
      actorName: actor
        ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() ||
          actor.email
        : 'System',
      targetId: res.id,
      targetName: res.title,
      severity: 'INFO',
      metadata: { dueDate: res.dueDate, testId: res.testId },
    });
    return res;
  }

  @Get('student')
  @UseGuards(JwtAuthGuard)
  async findForStudent(@Request() req: RequestWithUserAndQuery) {
    const studentId = req.query?.studentId || req.user?.id || '';
    const sectionId = req.query?.sectionId;
    return this.assignmentService.findForStudent(studentId, sectionId);
  }

  @Get('section/:sectionId')
  async findBySection(@Param('sectionId') sectionId: string) {
    return this.assignmentService.findBySection(sectionId);
  }

  @Get('facilitator/:facilitatorId')
  async findByFacilitator(@Param('facilitatorId') facilitatorId: string) {
    return this.assignmentService.findByFacilitator(facilitatorId);
  }

  @Get('institution/:institutionId')
  async findByInstitution(@Param('institutionId') institutionId: string) {
    return this.assignmentService.findByInstitution(institutionId);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.assignmentService.updateStatus(id, status);
  }

  @Get(':id/live')
  async getLiveStatus(@Param('id') id: string) {
    return this.assignmentService.getLiveStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: RequestWithUserAndQuery) {
    const res = await this.assignmentService.delete(id);
    const actor = req.user;
    void this.logsService.log({
      action: 'ASSIGNMENT_DELETED',
      category: 'ASSIGNMENT',
      actorId: actor?.id,
      actorName: actor
        ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() ||
          actor.email
        : 'System',
      targetId: res.id,
      targetName: res.title,
      severity: 'WARNING',
    });
    return res;
  }
}
