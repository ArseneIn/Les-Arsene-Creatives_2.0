import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeatureGuard } from '../auth/guards/feature.guard';
import { RequireFeature } from '../auth/decorators/require-feature.decorator';
import { Feature } from '../subscriptions/enums/feature.enum';

@Controller('discipline')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(Feature.DISCIPLINE)
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post()
  create(@Body() createDisciplineDto: CreateDisciplineDto) {
    return this.disciplineService.create(createDisciplineDto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId?: string) {
    return this.disciplineService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplineDto: UpdateDisciplineDto,
  ) {
    return this.disciplineService.update(id, updateDisciplineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplineService.remove(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.disciplineService.findByStudent(studentId);
  }
}
