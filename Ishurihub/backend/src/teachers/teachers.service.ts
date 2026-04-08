import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

import { Classroom } from '../classes/entities/classroom.entity';
import { In } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async findByEmail(email: string) {
    return this.teachersRepository.findOne({ where: { email } });
  }

  async getMyClasses(email: string) {
    const teacher = await this.findByEmail(email);
    if (!teacher || !teacher.classes || teacher.classes.length === 0) {
      return [];
    }

    // Fetch full classroom details
    return this.classroomRepository.find({
      where: {
        id: In(teacher.classes),
      },
    });
  }

  create(createTeacherDto: CreateTeacherDto) {
    const teacher = this.teachersRepository.create(createTeacherDto);
    return this.teachersRepository.save(teacher);
  }

  findAll(schoolId?: string) {
    if (schoolId) {
      return this.teachersRepository.find({ where: { schoolId } });
    }
    return this.teachersRepository.find();
  }

  findOne(id: string) {
    return this.teachersRepository.findOne({ where: { id } });
  }

  update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return this.teachersRepository.update(id, updateTeacherDto);
  }

  remove(id: string) {
    return this.teachersRepository.delete(id);
  }
}
