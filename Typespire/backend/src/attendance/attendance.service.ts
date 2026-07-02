import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async bulkSave(
    sectionId: string,
    dateStr: string,
    records: { studentId: string; status: string }[],
    recordedById?: string,
  ) {
    // Standardize to UTC date (midnight) to prevent timezone shifts
    const date = new Date(dateStr + 'T00:00:00.000Z');

    return this.prisma.$transaction(
      records.map((record) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            date_studentId_sectionId: {
              date,
              studentId: record.studentId,
              sectionId,
            },
          },
          update: {
            status: record.status,
            recordedById: recordedById || null,
          },
          create: {
            date,
            sectionId,
            studentId: record.studentId,
            status: record.status,
            recordedById: recordedById || null,
          },
        }),
      ),
    );
  }

  async findForSectionAndDate(sectionId: string, dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00.000Z');
    return this.prisma.attendanceRecord.findMany({
      where: {
        sectionId,
        date,
      },
    });
  }
}
