import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { School } from '../schools/entities/school.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    let studentId = createStudentDto.studentId;

    if (!studentId) {
      const year =
        createStudentDto.admissionYear || new Date().getFullYear().toString();

      const school = await this.schoolRepository.findOne({
        where: { id: createStudentDto.schoolId },
      });
      const abbrev =
        school?.abbreviation ||
        school?.name?.substring(0, 3).toUpperCase() ||
        'STU';

      // Find the last student in this year
      const prefix = `${abbrev}-${year}-`;
      const lastStudent = await this.studentsRepository.findOne({
        where: {
          schoolId: createStudentDto.schoolId,
          studentId: Like(`${prefix}%`),
        },
        order: { studentId: 'DESC' },
      });

      let sequenceNumber = 1;
      if (lastStudent && lastStudent.studentId) {
        const parts = lastStudent.studentId.split('-');
        const lastNumStr = parts[parts.length - 1];
        if (lastNumStr && !isNaN(parseInt(lastNumStr))) {
          sequenceNumber = parseInt(lastNumStr) + 1;
        }
      }

      studentId = `${prefix}${sequenceNumber.toString().padStart(3, '0')}`;
    }

    const student = this.studentsRepository.create({
      ...createStudentDto,
      studentId,
    });

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
