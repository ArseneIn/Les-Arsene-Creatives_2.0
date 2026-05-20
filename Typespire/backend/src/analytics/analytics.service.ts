import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const totalInstitutions = await this.prisma.institution.count();

    // Count active students (role STUDENT)
    const activeStudents = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
      },
    });

    // Calculate global average WPM and Accuracy from all test results
    const testResults = await this.prisma.testResult.aggregate({
      _avg: {
        wpm: true,
        accuracy: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalInstitutions,
      activeStudents,
      avgWpm: Math.round(testResults._avg.wpm || 0),
      avgAccuracy: parseFloat((testResults._avg.accuracy || 0).toFixed(1)),
      totalTestsTaken: testResults._count.id,
    };
  }

  async getFacilitatorStats(facilitatorId: string) {
    // 1. Get all sections for this facilitator
    const sections = await this.prisma.section.findMany({
      where: { facilitatorId },
      include: {
        students: {
          include: {
            testResults: {
              orderBy: { createdAt: 'desc' },
              take: 10,
              include: { test: true },
            },
          },
        },
      },
    });

    let totalStudents = 0;
    let sumWpm = 0;
    let sumAccuracy = 0;
    let testCount = 0;
    const studentsWithStats: any[] = [];

    // Process students
    for (const section of sections) {
      for (const student of section.students) {
        totalStudents++;

        let avgStudentWpm = 0;
        let avgStudentAcc = 0;
        const testsTaken = student.testResults.length;

        if (testsTaken > 0) {
          avgStudentWpm = Math.round(
            student.testResults.reduce((sum, tr) => sum + tr.wpm, 0) /
              testsTaken,
          );
          avgStudentAcc = Math.round(
            student.testResults.reduce((sum, tr) => sum + tr.accuracy, 0) /
              testsTaken,
          );
          sumWpm += avgStudentWpm;
          sumAccuracy += avgStudentAcc;
          testCount++;
        }

        studentsWithStats.push({
          id: student.id,
          name:
            `${student.firstName} ${student.lastName}`.trim() ||
            student.username,
          sectionId: section.id,
          sectionName: section.name,
          avgWpm: avgStudentWpm,
          avgAccuracy: avgStudentAcc,
          testsTaken,
          lastActive: student.testResults[0]?.createdAt || null,
        });
      }
    }

    return {
      totalStudents,
      avgClassWpm: testCount > 0 ? Math.round(sumWpm / testCount) : 0,
      avgClassAccuracy: testCount > 0 ? Math.round(sumAccuracy / testCount) : 0,
      students: studentsWithStats,
    };
  }
}
