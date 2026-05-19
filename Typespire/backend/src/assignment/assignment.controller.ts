import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      dueDate: string;
      sectionId?: string;
      studentIds?: string[];
    },
  ) {
    return this.assignmentService.create(body);
  }

  @Get('section/:sectionId')
  async findBySection(@Param('sectionId') sectionId: string) {
    return this.assignmentService.findBySection(sectionId);
  }

  @Get('facilitator/:facilitatorId')
  async findByFacilitator(@Param('facilitatorId') facilitatorId: string) {
    return this.assignmentService.findByFacilitator(facilitatorId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.assignmentService.updateStatus(id, status);
  }
}
