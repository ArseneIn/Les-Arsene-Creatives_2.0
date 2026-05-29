import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

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
      include: { 
        intake: {
          include: { institution: true }
        }, 
        students: true 
      },
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

  async generateUniqueUsername(
    name: string,
    institutionId: string,
  ): Promise<string> {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '.')
      .replace(/\.+/g, '.');
    let username = base;
    let count = 1;
    while (true) {
      const existing = await this.prisma.user.findFirst({
        where: { username, institutionId },
      });
      if (!existing) {
        return username;
      }
      username = `${base}${count}`;
      count++;
    }
  }

  async bulkImportStudents(
    sectionId: string,
    students: {
      name: string;
      email?: string;
      username?: string;
      password?: string;
    }[],
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
        let user: any = null;

        // 1. Try to find existing student by email
        if (student.email) {
          user = await this.prisma.user.findUnique({
            where: { email: student.email },
          });
        }

        // 2. Try to find existing student by username in this institution
        if (!user && student.username) {
          user = await this.prisma.user.findFirst({
            where: {
              username: student.username,
              institutionId: section.intake.institutionId,
            },
          });
        }

        if (!user) {
          // Create new user (student)
          const rawPassword = student.password || '1234';
          const hashedPassword = await bcrypt.hash(rawPassword, 10);

          const [firstName, ...lastNameParts] = student.name.split(' ');
          const lastName = lastNameParts.join(' ');

          const username =
            student.username ||
            (await this.generateUniqueUsername(
              student.name,
              section.intake.institutionId,
            ));

          user = await this.prisma.user.create({
            data: {
              email: student.email || null,
              username,
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
              `User ${student.email || student.username} exists but is not a student`,
            );
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Failed to add ${student.name}: ${message}`);
      }
    }

    return results;
  }

  async resetStudentPassword(
    sectionId: string,
    studentId: string,
    newPassword?: string,
  ) {
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        sectionId,
        role: 'STUDENT',
      },
    });

    if (!student) {
      throw new Error('Student not found in this section');
    }

    const passwordToHash = newPassword || '1234';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    return this.prisma.user.update({
      where: { id: studentId },
      data: { password: hashedPassword },
    });
  }
}
