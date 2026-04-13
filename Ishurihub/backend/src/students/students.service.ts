import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentsRepository.create(createStudentDto);
    return this.studentsRepository.save(student);
  }

  createBulk(createStudentDtos: CreateStudentDto[]) {
    const students = this.studentsRepository.create(createStudentDtos);
    return this.studentsRepository.save(students);
  }

  findAll(schoolId?: string, search?: string) {
    const where: Record<string, unknown> = {};
    if (schoolId) {
      where.schoolId = schoolId;
    }

    // Allow searching by name OR studentId
    if (search && schoolId) {
      return this.studentsRepository.find({
        where: [
          { schoolId, name: Like(`%${search}%`) },
          { schoolId, studentId: Like(`%${search}%`) },
        ],
      });
    } else if (search) {
      return this.studentsRepository.find({
        where: [
          { name: Like(`%${search}%`) },
          { studentId: Like(`%${search}%`) },
        ],
      });
    }

    return this.studentsRepository.find({ where });
  }

  findOne(id: string) {
    return this.studentsRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.studentsRepository.findOne({ where: { email } });
  }

  findBySchoolAndName(schoolId: string, name: string) {
    return this.studentsRepository.findOne({ where: { schoolId, name } });
  }

  findByCardUid(cardUid: string) {
    return this.studentsRepository.findOne({ where: { cardUid } });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.studentsRepository.update(id, updateStudentDto);
  }

  async updatePhoto(id: string, avatarUrl: string): Promise<Student> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    student.avatarUrl = avatarUrl;
    return this.studentsRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    await this.studentsRepository.delete(id);
  }
}
