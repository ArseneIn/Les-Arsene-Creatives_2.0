import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateBulkAttendanceDto } from './dto/create-bulk-attendance.dto';
import { AcademicYearsService } from '../academic-years/academic-years.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
    private academicYearsService: AcademicYearsService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    // 1. Find Active Term
    const activeTerm = await this.academicYearsService.findActiveTerm(
      createAttendanceDto.schoolId,
    );
    if (!activeTerm) {
      throw new BadRequestException(
        'No Active Term found. Please activate a term in System Settings.',
      );
    }

    const record = this.attendanceRepository.create({
      ...createAttendanceDto,
      termId: activeTerm.id,
    });
    return this.attendanceRepository.save(record);
  }

  async createBulk(createBulkAttendanceDto: CreateBulkAttendanceDto) {
    const { records, schoolId, classId, date } = createBulkAttendanceDto;

    // 1. Find Active Term
    const activeTerm = await this.academicYearsService.findActiveTerm(schoolId);
    if (!activeTerm) {
      throw new BadRequestException(
        'No Active Term found. Please activate a term in System Settings.',
      );
    }

    const savedRecords: AttendanceRecord[] = [];

    for (const recordDto of records) {
      // Check if record exists for this student and date
      const existingRecord = await this.attendanceRepository.findOne({
        where: {
          studentId: recordDto.studentId,
          date: date,
          schoolId: schoolId,
        },
      });

      if (existingRecord) {
        // Update
        existingRecord.status = recordDto.status;
        existingRecord.remarks = recordDto.remarks as string;
        existingRecord.classId = classId;
        existingRecord.teacherId = recordDto.teacherId as string;
        savedRecords.push(await this.attendanceRepository.save(existingRecord));
      } else {
        // Create
        const newRecord = this.attendanceRepository.create({
          ...recordDto,
          date: date,
          schoolId: schoolId,
          classId: classId,
          termId: activeTerm.id,
        });
        savedRecords.push(await this.attendanceRepository.save(newRecord));
      }
    }

    return savedRecords;
  }

  async findAll(schoolId: string, date?: string) {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('attendance.schoolId = :schoolId', { schoolId });

    if (date) {
      query.andWhere('attendance.date = :date', { date });
    }

    return query.getMany();
  }

  async getStats(schoolId: string) {
    const today = new Date().toISOString().split('T')[0];
    const records = await this.attendanceRepository.find({
      where: { schoolId, date: today },
    });

    const total = records.length;
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;

    return {
      date: today,
      total,
      present,
      absent,
      late,
      attendanceRate: total > 0 ? (present / total) * 100 : 0,
    };
  }

  async getWeeklyTrends(schoolId: string) {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const records = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.schoolId = :schoolId', { schoolId })
      .andWhere('attendance.date >= :start', {
        start: sevenDaysAgo.toISOString().split('T')[0],
      })
      .orderBy('attendance.date', 'ASC')
      .getMany();

    // Group by date
    const grouped = records.reduce(
      (acc, curr) => {
        const date = curr.date; // string YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = { date, students: 0, teachers: 0 };
        }
        // Ideally we distinguish type, assuming these are students for now as per entity
        // If entity has 'userType' or similar, filter here.
        // Assuming Student Attendance for now on this repo
        if (curr.studentId)
          acc[date].students +=
            curr.status === 'Present' || curr.status === 'Late' ? 1 : 0;
        return acc;
      },
      {} as Record<
        string,
        { date: string; students: number; teachers: number }
      >,
    );

    return Object.values(grouped);
  }

  async findByStudent(studentId: string) {
    const records = await this.attendanceRepository.find({
      where: { studentId },
      order: { date: 'DESC' },
    });

    const total = records.length;
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;

    return {
      history: records,
      stats: {
        total,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? (present / total) * 100 : 0,
      },
    };
  }
}
