import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestResultService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    wpm: number;
    accuracy: number;
    duration: number;
    strugglingKeys?: Record<string, number>;
    userId: string;
    testId?: string;
    assignmentId?: string;
  }) {
    let resolvedTestId = data.testId;
    if (!resolvedTestId && data.assignmentId) {
      const assignment = await this.prisma.assignment.findUnique({
        where: { id: data.assignmentId },
        select: { testId: true },
      });
      if (assignment?.testId) {
        resolvedTestId = assignment.testId;
      }
    }

    if (!resolvedTestId) {
      const firstTest = await this.prisma.test.findFirst();
      resolvedTestId = firstTest?.id;
    }

    if (!resolvedTestId) {
      throw new Error('A valid testId must be provided or resolved.');
    }

    return this.prisma.testResult.create({
      data: {
        wpm: data.wpm,
        accuracy: data.accuracy,
        duration: data.duration,
        strugglingKeys: data.strugglingKeys || {},
        userId: data.userId,
        testId: resolvedTestId,
        assignmentId: data.assignmentId,
      },
    });
  }

  async findByStudent(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: {
        test: {
          select: { title: true },
        },
        assignment: {
          select: { title: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // latest 50 results
    });
  }

  async findByAssignment(assignmentId: string) {
    // Fetch assignment thresholds alongside results
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { wpmRequirement: true, accuracyRequirement: true },
    });

    const passWpm = assignment?.wpmRequirement ?? 20;
    const passAccuracy = assignment?.accuracyRequirement ?? 70;

    const results = await this.prisma.testResult.findMany({
      where: { assignmentId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, username: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by userId to calculate attempts and best scores
    const byStudent = new Map<string, typeof results>();
    for (const r of results) {
      const group = byStudent.get(r.userId) || [];
      group.push(r);
      byStudent.set(r.userId, group);
    }

    return Array.from(byStudent.entries()).map(([userId, attempts]) => {
      const best = attempts.reduce((a, b) => (a.wpm > b.wpm ? a : b));
      const passed = best.wpm >= passWpm && best.accuracy >= passAccuracy;
      return {
        userId,
        firstName: best.user.firstName,
        lastName: best.user.lastName,
        email: best.user.email,
        username: best.user.username,
        attempts: attempts.length,
        bestWpm: best.wpm,
        bestAccuracy: best.accuracy,
        durationSec: best.duration,
        passed,
        passWpm,
        passAccuracy,
        submittedAt: best.createdAt,
      };
    });
  }

  async findByInstitution(institutionId: string) {
    return this.prisma.testResult.findMany({
      where: {
        user: {
          institutionId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            section: {
              select: {
                name: true,
                intake: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        test: {
          select: {
            title: true,
            difficulty: true,
          },
        },
        assignment: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200, // Limit to 200 most recent for performance
    });
  }

  async findBySection(sectionId: string) {
    return this.prisma.testResult.findMany({
      where: {
        user: {
          sectionId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        test: {
          select: {
            title: true,
            difficulty: true,
          },
        },
        assignment: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
