import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { RandomizeStudentsDto } from './dto/randomize-students.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: Partial<CreateClassDto>) {
    return this.classesService.update(id, updateClassDto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId: string) {
    return this.classesService.findAll(schoolId);
  }

  @Post('randomize')
  randomize(@Body() randomizeStudentsDto: RandomizeStudentsDto) {
    return this.classesService.randomizeStudents(randomizeStudentsDto);
  }

  @Get(':id/students')
  getStudents(@Param('id') id: string) {
    return this.classesService.findStudents(id);
  }

  @Post(':id/students')
  addStudents(@Param('id') id: string, @Body('studentIds') studentIds: string[]) {
    return this.classesService.addStudents(id, studentIds);
  }

  @Post(':id/sync')
  async syncStudents(@Param('id') id: string) {
    await this.classesService.syncClassStudents(id);
    return { message: 'Synchronization started' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
