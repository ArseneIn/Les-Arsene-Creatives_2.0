import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { CreateFacilitatorDto } from './dto/create-facilitator.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LogsService } from '../logs/logs.service';

@Controller('institution')
export class InstitutionController {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createInstitutionDto: CreateInstitutionDto, @Request() req: any) {
    const res = await this.institutionService.create(createInstitutionDto);
    const actor = req.user;
    void this.logsService.log({
      action: 'INSTITUTION_CREATED',
      category: 'INSTITUTION',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email || 'System' : 'System',
      targetId: res.id,
      targetName: res.name,
      severity: 'INFO',
      metadata: { slug: res.slug, contactEmail: res.contactEmail || undefined },
    });
    return res;
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
    @Request() req: any,
  ) {
    const res = await this.institutionService.update(id, updateInstitutionDto);
    const actor = req.user;
    void this.logsService.log({
      action: 'INSTITUTION_UPDATED',
      category: 'INSTITUTION',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email || 'System' : 'System',
      targetId: res.id,
      targetName: res.name,
      severity: 'INFO',
      metadata: { slug: res.slug, contactEmail: res.contactEmail || undefined },
    });
    return res;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const res = await this.institutionService.remove(id);
    const actor = req.user;
    void this.logsService.log({
      action: 'INSTITUTION_DELETED',
      category: 'INSTITUTION',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email || 'System' : 'System',
      targetId: res.id,
      targetName: res.name,
      severity: 'WARNING',
    });
    return res;
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Param('id') id: string) {
    return this.institutionService.getStats(id);
  }

  @Get(':id/facilitators')
  @UseGuards(JwtAuthGuard)
  getFacilitators(@Param('id') id: string) {
    return this.institutionService.getFacilitators(id);
  }

  @Post(':id/facilitators')
  @UseGuards(JwtAuthGuard)
  async inviteFacilitator(
    @Param('id') id: string,
    @Body() createFacilitatorDto: CreateFacilitatorDto,
    @Request() req: any,
  ) {
    const res = await this.institutionService.inviteFacilitator(id, createFacilitatorDto);
    const actor = req.user;
    void this.logsService.log({
      action: 'FACILITATOR_INVITED',
      category: 'INSTITUTION',
      actorId: actor?.id,
      actorName: actor ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email || 'System' : 'System',
      targetId: res.id,
      targetName: `${res.firstName || ''} ${res.lastName || ''}`.trim() || res.email || 'Facilitator',
      severity: 'INFO',
      metadata: { email: res.email || undefined },
    });
    return res;
  }

  @Get(':id/reports/intake-performance')
  @UseGuards(JwtAuthGuard)
  async getIntakePerformanceReport(@Param('id') id: string) {
    return this.institutionService.getIntakePerformanceReport(id);
  }

  @Get(':id/reports/student-progress')
  @UseGuards(JwtAuthGuard)
  async getStudentProgressReport(@Param('id') id: string) {
    return this.institutionService.getStudentProgressReport(id);
  }

  @Get(':id/reports/facilitator-activity')
  @UseGuards(JwtAuthGuard)
  async getFacilitatorActivityReport(@Param('id') id: string) {
    return this.institutionService.getFacilitatorActivityReport(id);
  }
}
