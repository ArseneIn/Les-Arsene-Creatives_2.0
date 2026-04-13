import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subjects.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectsRepository.create(createSubjectDto);
    return this.subjectsRepository.save(subject);
  }

  findAll(schoolId: string, search?: string) {
    const where: FindOptionsWhere<Subject> = { schoolId };
    if (search) {
      where.name = Like(`%${search}%`);
    }
    return this.subjectsRepository.find({ where, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const subject = await this.subjectsRepository.findOne({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.subjectsRepository.update(
      id,
      updateSubjectDto as QueryDeepPartialEntity<Subject>,
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    const subject = await this.findOne(id);
    return this.subjectsRepository.remove(subject);
  }
}
