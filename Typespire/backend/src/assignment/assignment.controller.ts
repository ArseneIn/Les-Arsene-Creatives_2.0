import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

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
    },
    @Request() req: any,
  ) {
    const res = await this.assignmentService.create(body);
    const actor = req.user;
    void this.logsService.log({
      action: 'ASSIGNMENT_PUBLISHED',
      category: 'ASSIGNMENT',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email : 'System',
      targetId: res.id,
      targetName: res.title,
      severity: 'INFO',
      metadata: { dueDate: res.dueDate, testId: res.testId },
    });
    return res;
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
  async delete(@Param('id') id: string, @Request() req: any) {
    const res = await this.assignmentService.delete(id);
    const actor = req.user;
    void this.logsService.log({
      action: 'ASSIGNMENT_DELETED',
      category: 'ASSIGNMENT',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email : 'System',
      targetId: res.id,
      targetName: res.title,
      severity: 'WARNING',
    });
    return res;
  }
}

