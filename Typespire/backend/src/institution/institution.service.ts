import { Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { CreateFacilitatorDto } from './dto/create-facilitator.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) { }

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
    return this.prisma.institution.update({
      where: { id },
      data: updateInstitutionDto,
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
            students: true,
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

      return {
        intakeName: intake.name,
        startDate: intake.startDate,
        endDate: intake.endDate,
        status: intake.status,
        totalSections: intake.sections.length,
        totalStudents,
        // Placeholder for performance metrics (WPM/Accuracy) until TestResults are linked to Intakes/Sections
        avgWpm: 0,
        avgAccuracy: 0,
      };
    });
  }
}
