import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { CreateFacilitatorDto } from './dto/create-facilitator.dto';

@Controller('institution')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Get()
  findAll() {
    return this.institutionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.institutionService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.institutionService.remove(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.institutionService.getStats(id);
  }

  @Get(':id/facilitators')
  getFacilitators(@Param('id') id: string) {
    return this.institutionService.getFacilitators(id);
  }

  @Post(':id/facilitators')
  async inviteFacilitator(
    @Param('id') id: string,
    @Body() createFacilitatorDto: CreateFacilitatorDto,
  ) {
    return this.institutionService.inviteFacilitator(id, createFacilitatorDto);
  }

  @Get(':id/reports/intake-performance')
  async getIntakePerformanceReport(@Param('id') id: string) {
    return this.institutionService.getIntakePerformanceReport(id);
  }

  @Get(':id/reports/student-progress')
  async getStudentProgressReport(@Param('id') id: string) {
    return this.institutionService.getStudentProgressReport(id);
  }

  @Get(':id/reports/facilitator-activity')
  async getFacilitatorActivityReport(@Param('id') id: string) {
    return this.institutionService.getFacilitatorActivityReport(id);
  }
}
