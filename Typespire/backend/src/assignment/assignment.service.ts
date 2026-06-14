import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    dueDate: string;
    sectionId?: string;
    studentIds?: string[];
    level?: number;
    duration?: number;
    content?: string;
    maxAttempts?: number;
    wpmRequirement?: number;
    accuracyRequirement?: number;
  }) {
    // Create the associated Test
    const test = await this.prisma.test.create({
      data: {
        title: data.title,
        content:
          data.content ||
          (data.level === 2
            ? "The Quick brown fox ran past Mary Johnson's garden, leaving 12 footprints before sunset. Alice said Hello to Dr. Kim every single Monday. In 2024, Real Madrid won the Champions League again. James wrote: Dear Friend, Thank you for everything. Sarah visited Paris, London, and Tokyo in one summer. The river runs North, past Oak Street and into the Sea."
            : 'The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Practice makes perfect when learning to type fast. Keep your fingers on the home row and do not look at the keys.'),
        duration: data.duration ?? 60,
        difficulty: data.level === 2 ? 'HARD' : 'MEDIUM',
      },
    });

    return this.prisma.assignment.create({
      data: {
        title: data.title,
        dueDate: new Date(data.dueDate),
        sectionId: data.sectionId || null,
        studentIds: data.studentIds || [],
        testId: test.id,
        maxAttempts: data.maxAttempts || 1,
        wpmRequirement: data.wpmRequirement,
        accuracyRequirement: data.accuracyRequirement,
      },
    });
  }

  async runExpiryCheck() {
    const now = new Date();
    await this.prisma.assignment.updateMany({
      where: {
        status: 'ACTIVE',
        dueDate: {
          lt: now,
        },
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async findForStudent(studentId: string, sectionId?: string) {
    await this.runExpiryCheck();
    const orConditions: any[] = [{ studentIds: { has: studentId } }];
    if (sectionId) {
      orConditions.push({ sectionId: sectionId });
    }

    return this.prisma.assignment.findMany({
      where: {
        status: 'ACTIVE',
        OR: orConditions,
      },
      include: { test: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySection(sectionId: string) {
    await this.runExpiryCheck();
    return this.prisma.assignment.findMany({
      where: {
        sectionId: sectionId,
        status: 'ACTIVE',
      },
      include: { test: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByFacilitator(facilitatorId: string) {
    await this.runExpiryCheck();
    // A facilitator can have multiple sections.
    // Query assignments that belong to the sections assigned to this facilitator.
    const sections = await this.prisma.section.findMany({
      where: { facilitatorId },
      select: { id: true },
    });

    const sectionIds = sections.map((s) => s.id);

    return this.prisma.assignment.findMany({
      where: {
        OR: [
          { sectionId: { in: sectionIds } },
          { sectionId: null }, // Global/Shared assignments
        ],
      },
      include: { test: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.assignment.update({
      where: { id },
      data: { status },
    });
  }

  async findByInstitution(institutionId: string) {
    await this.runExpiryCheck();
    return this.prisma.assignment.findMany({
      where: {
        section: {
          intake: {
            institutionId,
          },
        },
      },
      include: {
        test: true,
        section: {
          include: {
            facilitator: true,
            intake: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string) {
    return this.prisma.assignment.delete({
      where: { id },
    });
  }

  async getLiveStatus(assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        section: {
          include: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
              },
            },
          },
        },
        testResults: {
          select: {
            userId: true,
            wpm: true,
            accuracy: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!assignment) return null;

    const passWpm = assignment.wpmRequirement ?? 20;
    const passAccuracy = assignment.accuracyRequirement ?? 70;

    // Map of userId -> best result
    const resultByUser = new Map<
      string,
      { wpm: number; accuracy: number; submittedAt: Date }
    >();
    for (const r of assignment.testResults) {
      const existing = resultByUser.get(r.userId);
      if (!existing || r.wpm > existing.wpm) {
        resultByUser.set(r.userId, {
          wpm: r.wpm,
          accuracy: r.accuracy,
          submittedAt: r.createdAt,
        });
      }
    }

    const students = assignment.section?.students ?? [];

    const studentStatuses = students.map((s) => {
      const result = resultByUser.get(s.id);
      const status = result ? 'Submitted' : 'Not Started';
      const passed = result
        ? result.wpm >= passWpm && result.accuracy >= passAccuracy
        : null;
      return {
        userId: s.id,
        name:
          `${s.firstName || ''} ${s.lastName || ''}`.trim() ||
          s.username ||
          s.email,
        status,
        wpm: result?.wpm ?? null,
        accuracy: result?.accuracy ?? null,
        passed,
        submittedAt: result?.submittedAt ?? null,
      };
    });

    return {
      assignmentId,
      title: assignment.title,
      dueDate: assignment.dueDate,
      passWpm,
      passAccuracy,
      totalStudents: students.length,
      submitted: studentStatuses.filter((s) => s.status === 'Submitted').length,
      students: studentStatuses,
    };
  }
}
