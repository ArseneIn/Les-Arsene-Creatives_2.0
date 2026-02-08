import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateTermDto } from './dto/create-term.dto';

@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly service: AcademicYearsService) {}

  @Post()
  createYear(@Body() dto: CreateAcademicYearDto) {
    return this.service.createYear(dto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId: string) {
    return this.service.findAllYears(schoolId);
  }

  @Patch(':id/activate')
  activateYear(@Param('id') id: string, @Body('schoolId') schoolId: string) {
    return this.service.setActiveYear(id, schoolId);
  }

  @Post('terms')
  createTerm(@Body() dto: CreateTermDto) {
    return this.service.createTerm(dto);
  }

  @Patch('terms/:id/activate')
  activateTerm(@Param('id') id: string, @Body('schoolId') schoolId: string) {
    return this.service.setActiveTerm(id, schoolId);
  }
}
