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
  }) {
    return this.prisma.assignment.create({
      data: {
        title: data.title,
        dueDate: new Date(data.dueDate),
        sectionId: data.sectionId || null,
        studentIds: data.studentIds || [],
      },
    });
  }

  async findBySection(sectionId: string) {
    return this.prisma.assignment.findMany({
      where: {
        sectionId: sectionId,
        status: 'ACTIVE',
      },
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
