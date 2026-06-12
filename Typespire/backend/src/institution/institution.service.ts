import { Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { CreateFacilitatorDto } from './dto/create-facilitator.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async create(createInstitutionDto: CreateInstitutionDto) {
    const {
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
      ...institutionData
    } = createInstitutionDto;

    return this.prisma.$transaction(async (prisma) => {
      const institution = await prisma.institution.create({
        data: institutionData,
      });

      if (adminEmail && adminPassword) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            firstName: adminFirstName || 'Admin',
            lastName: adminLastName || 'User',
            role: 'INSTITUTION_ADMIN',
            institutionId: institution.id,
          },
        });
      }

      return institution;
    });
  }

  findAll() {
    return this.prisma.institution.findMany();
  }

  findOne(id: string) {
    return this.prisma.institution.findUnique({
      where: { id },
    });
  }

  update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    const {
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
      ...rest
    } = updateInstitutionDto;
    return this.prisma.institution.update({
      where: { id },
      data: rest,
    });
  }

  async getStats(institutionId: string) {
    const totalFacilitators = await this.prisma.user.count({
      where: {
        institutionId,
        role: 'FACILITATOR',
      },
    });

    const activeIntakes = await this.prisma.intake.count({
      where: {
        institutionId,
        status: 'ACTIVE',
      },
    });

    const testResults = await this.prisma.testResult.findMany({
      where: {
        user: {
          institutionId,
        },
      },
      select: {
        wpm: true,
        accuracy: true,
      },
    });

    const totalResults = testResults.length;
    const avgWpm =
      totalResults > 0
        ? testResults.reduce((sum, r) => sum + r.wpm, 0) / totalResults
        : 0;
    const avgAccuracy =
      totalResults > 0
        ? testResults.reduce((sum, r) => sum + r.accuracy, 0) / totalResults
        : 0;

    return {
      totalFacilitators,
      activeIntakes,
      avgWpm: Math.round(avgWpm),
      avgAccuracy: parseFloat(avgAccuracy.toFixed(1)),
    };
  }

  async getFacilitators(institutionId: string) {
    return this.prisma.user.findMany({
      where: {
        institutionId,
        role: 'FACILITATOR',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        facilitatedSections: {
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
    });
  }

  remove(id: string) {
    return this.prisma.institution.delete({
      where: { id },
    });
  }

  async inviteFacilitator(
    institutionId: string,
    createFacilitatorDto: CreateFacilitatorDto,
  ) {
    const { email, firstName, lastName } = createFacilitatorDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash default password (e.g., "password123") - In prod, send invite email
    const hashedPassword = await bcrypt.hash('password123', 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'FACILITATOR',
        institutionId,
      },
    });
  }

  async getIntakePerformanceReport(institutionId: string) {
    const intakes = await this.prisma.intake.findMany({
      where: { institutionId },
      include: {
        sections: {
          include: {
            students: {
              include: {
                testResults: true,
              },
            },
          },
        },
      },
    });

    // Transform to a flat structure suitable for reports
    return intakes.map((intake) => {
      const totalStudents = intake.sections.reduce(
        (sum, section) => sum + section.students.length,
        0,
      );

      const allResults = intake.sections.flatMap((section) =>
        section.students.flatMap((student) => student.testResults),
      );

      const totalResults = allResults.length;
      const avgWpm =
        totalResults > 0
          ? allResults.reduce((sum, r) => sum + r.wpm, 0) / totalResults
          : 0;
      const avgAccuracy =
        totalResults > 0
          ? allResults.reduce((sum, r) => sum + r.accuracy, 0) / totalResults
          : 0;

      return {
        intakeName: intake.name,
        startDate: intake.startDate.toISOString().split('T')[0],
        endDate: intake.endDate
          ? intake.endDate.toISOString().split('T')[0]
          : 'Ongoing',
        status: intake.status,
        totalSections: intake.sections.length,
        totalStudents,
        avgWpm: Math.round(avgWpm),
        avgAccuracy: parseFloat(avgAccuracy.toFixed(1)),
      };
    });
  }

  async getStudentProgressReport(institutionId: string) {
    const students = await this.prisma.user.findMany({
      where: {
        institutionId,
        role: 'STUDENT',
      },
      include: {
        section: {
          include: {
            intake: true,
          },
        },
        testResults: {
          include: {
            test: true,
          },
        },
      },
    });

    return students.map((student) => {
      const totalTests = student.testResults.length;
      const avgWpm =
        totalTests > 0
          ? student.testResults.reduce((sum, r) => sum + r.wpm, 0) / totalTests
          : 0;
      const avgAccuracy =
        totalTests > 0
          ? student.testResults.reduce((sum, r) => sum + r.accuracy, 0) /
            totalTests
          : 0;

      // Deduce milestone status based on the latest test scores
      let status = 'Practicing';
      student.testResults.forEach((r) => {
        const title = (r.test?.title || '').toLowerCase();
        const passed = r.wpm >= 20 && r.accuracy >= 70;
        const isPractice =
          title.includes('practice') || title.includes('drill');

        if (!isPractice) {
          if (title.includes('level 2') && passed) {
            status = 'Passed';
          } else if (
            (title.includes('level 1') && passed) ||
            title.includes('level 2')
          ) {
            status = 'Level 2';
          } else {
            status = 'Level 1';
          }
        }
      });

      return {
        studentId: student.id.substring(0, 8).toUpperCase(),
        name:
          `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
          student.email ||
          student.username ||
          'Student',
        email: student.email || student.username || '',
        intake: student.section?.intake?.name || 'N/A',
        section: student.section?.name || 'Unassigned',
        totalTests,
        avgWpm: Math.round(avgWpm),
        avgAccuracy: parseFloat(avgAccuracy.toFixed(1)),
        milestoneStatus: status,
      };
    });
  }

  async getFacilitatorActivityReport(institutionId: string) {
    const facilitators = await this.prisma.user.findMany({
      where: {
        institutionId,
        role: 'FACILITATOR',
      },
      include: {
        facilitatedSections: {
          include: {
            intake: true,
            students: true,
          },
        },
      },
    });

    return facilitators.map((f) => {
      const totalSections = f.facilitatedSections.length;
      const totalStudents = f.facilitatedSections.reduce(
        (sum, s) => sum + s.students.length,
        0,
      );
      const assignedIntakes = Array.from(
        new Set(f.facilitatedSections.map((s) => s.intake.name)),
      ).join(', ');

      return {
        facilitatorId: f.id.substring(0, 8).toUpperCase(),
        name: `${f.firstName || ''} ${f.lastName || ''}`.trim() || f.email,
        email: f.email,
        totalSections,
        totalStudents,
        assignedIntakes: assignedIntakes || 'None',
        status: 'Active',
      };
    });
  }
}
