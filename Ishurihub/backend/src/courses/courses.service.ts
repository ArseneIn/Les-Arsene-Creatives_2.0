import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  findAll(schoolId: string, classId?: string, academicYearId?: string) {
    const where: FindOptionsWhere<Course> = { schoolId };
    if (classId) where.classId = classId;
    if (academicYearId) where.academicYearId = academicYearId;

    return this.coursesRepository.find({
      where,
      relations: ['subject', 'teacher', 'classroom', 'academicYear'],
      order: { subject: { name: 'ASC' } },
    });
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['subject', 'teacher', 'classroom', 'academicYear'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.coursesRepository.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    return this.coursesRepository.remove(course);
  }
}
