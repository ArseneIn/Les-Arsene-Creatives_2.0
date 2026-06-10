import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { Student } from '../students/entities/student.entity';
import { DisciplineRecord } from './entities/discipline.entity';
import { DisciplinePolicy } from './entities/discipline-policy.entity';
import {
  CreateDisciplinePolicyDto,
  UpdateDisciplinePolicyDto,
} from './dto/discipline-policy.dto';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(DisciplineRecord)
    private disciplineRepository: Repository<DisciplineRecord>,
    @InjectRepository(DisciplinePolicy)
    private policyRepository: Repository<DisciplinePolicy>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  // --- POLICIES ---

  async createPolicy(createDto: CreateDisciplinePolicyDto) {
    const policy = this.policyRepository.create(createDto);
    return this.policyRepository.save(policy);
  }

  async getPolicies(schoolId: string) {
    return this.policyRepository.find({
      where: { schoolId },
      order: { type: 'ASC', name: 'ASC' },
    });
  }

  async updatePolicy(id: string, updateDto: UpdateDisciplinePolicyDto) {
    return this.policyRepository.update(id, updateDto);
  }

  async deletePolicy(id: string) {
    return this.policyRepository.delete(id);
  }

  // --- RECORDS ---

  async create(createDisciplineDto: CreateDisciplineDto) {
    const record = this.disciplineRepository.create(createDisciplineDto);

    if (createDisciplineDto.points && createDisciplineDto.points > 0) {
      const student = await this.studentRepository.findOne({
        where: { id: createDisciplineDto.studentId },
      });
      if (student) {
        const currentPoints = student.disciplinePoints ?? 100;

        if (createDisciplineDto.type === 'Merit') {
          // Awards add points, capped at 100
          student.disciplinePoints = Math.min(
            100,
            currentPoints + createDisciplineDto.points,
          );
        } else {
          // Sanctions/Reports deduct points, floored at 0
          student.disciplinePoints = Math.max(
            0,
            currentPoints - createDisciplineDto.points,
          );
        }

        await this.studentRepository.save(student);
      }
    }

    return this.disciplineRepository.save(record);
  }

  findAll(schoolId?: string) {
    if (schoolId) {
      return this.disciplineRepository.find({
        where: { schoolId },
        relations: ['student'],
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

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    return {
      points: student?.disciplinePoints ?? 100,
      records,
    };
  }

  async getAnalytics(schoolId: string) {
    const allRecords = await this.disciplineRepository.find({
      where: { schoolId },
      relations: ['student'],
    });

    const allStudents = await this.studentRepository.find({
      where: { schoolId },
    });

    const total = allRecords.length;
    const sanctions = allRecords.filter((r) => r.type === 'Sanction').length;
    const merits = allRecords.filter((r) => r.type === 'Merit').length;
    const pending = allRecords.filter((r) => r.status === 'Pending').length;
    const resolved = allRecords.filter((r) => r.status === 'Resolved').length;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    allRecords.forEach((r) => {
      categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Students at risk (points < 40)
    const atRiskStudents = allStudents
      .filter((s) => (s.disciplinePoints ?? 100) < 40)
      .map((s) => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
        points: s.disciplinePoints ?? 100,
      }));

    // Monthly breakdown (last 6 months)
    const now = new Date();
    const monthlyData: { month: string; sanctions: number; merits: number }[] =
      [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().slice(0, 7); // "YYYY-MM"
      const monthRecords = allRecords.filter((r) =>
        r.date.startsWith(monthStr),
      );
      monthlyData.push({
        month: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
        sanctions: monthRecords.filter((r) => r.type === 'Sanction').length,
        merits: monthRecords.filter((r) => r.type === 'Merit').length,
      });
    }

    // Class-level performance
    const classMap: Record<
      string,
      { totalPoints: number; studentCount: number; infractions: number }
    > = {};

    allStudents.forEach((s) => {
      const grade = s.grade || 'Unassigned';
      if (!classMap[grade]) {
        classMap[grade] = { totalPoints: 0, studentCount: 0, infractions: 0 };
      }
      classMap[grade].totalPoints += s.disciplinePoints ?? 100;
      classMap[grade].studentCount += 1;
    });

    allRecords.forEach((r) => {
      if (r.type === 'Sanction' && r.student && r.student.grade) {
        const grade = r.student.grade;
        if (classMap[grade]) {
          classMap[grade].infractions += 1;
        }
      }
    });

    const classPerformance = Object.entries(classMap)
      .map(([grade, stats]) => ({
        grade,
        averagePoints: Math.round(stats.totalPoints / stats.studentCount),
        infractions: stats.infractions,
      }))
      .sort((a, b) => a.averagePoints - b.averagePoints); // Sort worst performing first

    return {
      total,
      sanctions,
      merits,
      pending,
      resolved,
      topCategories,
      atRiskStudents,
      monthlyData,
      classPerformance,
    };
  }
}
