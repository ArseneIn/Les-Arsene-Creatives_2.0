import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

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
