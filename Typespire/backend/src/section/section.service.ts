import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) { }

  create(createSectionDto: CreateSectionDto) {
    return this.prisma.section.create({
      data: createSectionDto,
    });
  }

  findAll() {
    return this.prisma.section.findMany({
      include: { intake: true },
    });
  }

  findOne(id: string) {
    return this.prisma.section.findUnique({
      where: { id },
      include: { intake: true, students: true },
    });
  }

  update(id: string, updateSectionDto: UpdateSectionDto) {
    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  remove(id: string) {
    return this.prisma.section.delete({
      where: { id },
    });
  }

  async assignFacilitator(sectionId: string, facilitatorId: string) {
    // 1. Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!section) {
      throw new Error('Section not found'); // Will be handled by filter or use NotFoundException
    }

    // 2. Check if facilitator exists and has correct role
    const facilitator = await this.prisma.user.findUnique({
      where: { id: facilitatorId },
    });

    if (!facilitator) {
      throw new Error('Facilitator not found');
    }

    if (facilitator.role !== 'FACILITATOR') {
      throw new Error('User is not a facilitator');
    }

    // 3. Assign
    return this.prisma.section.update({
      where: { id: sectionId },
      data: { facilitatorId },
    });
  }
  async bulkImportStudents(
    sectionId: string,
    students: { name: string; email: string }[],
  ) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { intake: true },
    });

    if (!section) {
      throw new Error('Section not found');
    }

    const results: { added: number; errors: string[] } = {
      added: 0,
      errors: [],
    };

    for (const student of students) {
      try {
        // Check if user exists
        let user = await this.prisma.user.findUnique({
          where: { email: student.email },
        });

        if (!user) {
          // Create new user (student)
          // In a real app, we'd generate a random password and email them
          const hashedPassword = '$2b$10$EpIx.5v.5v.5v.5v.5v.5e'; // Placeholder hash
          const [firstName, ...lastNameParts] = student.name.split(' ');
          const lastName = lastNameParts.join(' ');

          user = await this.prisma.user.create({
            data: {
              email: student.email,
              password: hashedPassword,
              firstName: firstName || 'Student',
              lastName: lastName || '',
              role: 'STUDENT',
              institutionId: section.intake.institutionId,
              sectionId: section.id, // Assign to section
            },
          });
          results.added++;
        } else {
          // If user exists, update their section if they are a student
          if (user.role === 'STUDENT') {
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                sectionId: section.id,
                institutionId: section.intake.institutionId, // Ensure they belong to this institution
              },
            });
            results.added++;
          } else {
            results.errors.push(
              `User ${student.email} exists but is not a student`,
            );
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Failed to add ${student.email}: ${message}`);
      }
    }

    return results;
  }
}
