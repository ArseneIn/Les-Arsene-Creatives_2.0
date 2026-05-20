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
  }) {
    // Create the associated Test
    const test = await this.prisma.test.create({
      data: {
        title: data.title,
        content: data.level === 2 ? "The Quick brown fox ran past Mary Johnson's garden, leaving 12 footprints before sunset. Alice said Hello to Dr. Kim every single Monday. In 2024, Real Madrid won the Champions League again. James wrote: Dear Friend, Thank you for everything. Sarah visited Paris, London, and Tokyo in one summer. The river runs North, past Oak Street and into the Sea." : "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Practice makes perfect when learning to type fast. Keep your fingers on the home row and do not look at the keys.",
        duration: data.duration ?? 60,
        difficulty: data.level === 2 ? 'HARD' : 'MEDIUM',
      }
    });

    return this.prisma.assignment.create({
      data: {
        title: data.title,
        dueDate: new Date(data.dueDate),
        sectionId: data.sectionId || null,
        studentIds: data.studentIds || [],
        testId: test.id,
      },
    });
  }

  async findBySection(sectionId: string) {
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
}
