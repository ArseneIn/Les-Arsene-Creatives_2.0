import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { Student } from '../students/entities/student.entity';
import { DisciplineRecord } from './entities/discipline.entity';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(DisciplineRecord)
    private disciplineRepository: Repository<DisciplineRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createDisciplineDto: CreateDisciplineDto) {
    const record = this.disciplineRepository.create(createDisciplineDto);

    // Deduct points if specified
    if (createDisciplineDto.points && createDisciplineDto.points > 0) {
      const student = await this.studentRepository.findOne({
        where: { id: createDisciplineDto.studentId },
      });
      if (student) {
        student.disciplinePoints = Math.max(
          0,
          (student.disciplinePoints || 100) - createDisciplineDto.points,
        );
        await this.studentRepository.save(student);
      }
    }

    return this.disciplineRepository.save(record);
  }

  findAll(schoolId?: string) {
    if (schoolId) {
      return this.disciplineRepository.find({
        where: { schoolId },
        relations: ['student'], // Explicitly load student relation if eager is false (it's true in entity but good practice)
        order: { date: 'DESC' },
      });
    }
    return this.disciplineRepository.find({
      relations: ['student'],
      order: { date: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.disciplineRepository.findOne({
      where: { id },
      relations: ['student'],
    });
  }

  update(id: string, updateDisciplineDto: UpdateDisciplineDto) {
    return this.disciplineRepository.update(id, updateDisciplineDto);
  }

  remove(id: string) {
    return this.disciplineRepository.delete(id);
  }

  async findByStudent(studentId: string) {
    const records = await this.disciplineRepository.find({
      where: { studentId },
      order: { date: 'DESC' },
    });

    // Also fetch current points directly from student
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    return {
      points: student?.disciplinePoints || 100,
      records,
    };
  }
}
