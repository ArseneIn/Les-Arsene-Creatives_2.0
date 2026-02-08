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
}
