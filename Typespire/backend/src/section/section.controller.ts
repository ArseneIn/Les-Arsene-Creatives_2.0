import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionService.remove(id);
  }

  @Patch(':id/assign-facilitator')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION_ADMIN)
  assignFacilitator(
    @Param('id') id: string,
    @Body('facilitatorId') facilitatorId: string,
  ) {
    return this.sectionService.assignFacilitator(id, facilitatorId);
  }
  @Post(':id/students/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION_ADMIN, UserRole.FACILITATOR)
  bulkImport(
    @Param('id') id: string,
    @Body() data: { students: { name: string; email?: string; username?: string; password?: string }[] },
  ) {
    return this.sectionService.bulkImportStudents(id, data.students);
  }

  @Patch(':id/students/:studentId/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTITUTION_ADMIN, UserRole.FACILITATOR)
  resetPassword(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @Body('password') password?: string,
  ) {
    return this.sectionService.resetStudentPassword(id, studentId, password);
  }
}
