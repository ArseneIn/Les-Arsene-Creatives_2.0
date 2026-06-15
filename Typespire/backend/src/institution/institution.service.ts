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
            assignment: true,
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

      const hasPassedCapstone = student.testResults.some((r) => {
        const title = (r.test?.title || '').toLowerCase();
        return title.includes('capstone') && r.wpm >= 35 && r.accuracy >= 92;
      });

      student.testResults.forEach((r) => {
        const title = (r.test?.title || '').toLowerCase();
        const isPractice =
          (title.includes('practice') || title.includes('drill')) &&
          !title.includes('capstone');

        if (!isPractice && r.assignmentId && !r.bypassLevel) {
          const isL2 =
            title.includes('level 2') || r.test?.difficulty === 'HARD';
          const isL1 = !isL2;

          const passWpm = r.assignment?.wpmRequirement ?? 50;
          const passAccuracy =
            r.assignment?.accuracyRequirement ?? (isL2 ? 92 : 90);
          const passed = r.wpm >= passWpm && r.accuracy >= passAccuracy;

          if (isL2 && passed) {
            status = 'Passed';
          } else if (isL1 && passed) {
            if (status !== 'Passed') {
              status = 'Level 2';
            }
          } else if (isL1 || isL2) {
            if (status !== 'Passed' && status !== 'Level 2') {
              status = 'Level 1';
            }
          }
        }
      });

      if (status === 'Practicing' && hasPassedCapstone) {
        status = 'Level 1';
      }

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

  async bulkImportMaster(
    institutionId: string,
    students: {
      studentId?: string;
      name: string;
      email?: string;
      intakeName: string;
      sectionName: string;
    }[],
  ) {
    const results = {
      added: 0,
      errors: [] as string[],
    };

    // Cache of created intakes and sections to avoid constant DB queries
    const intakeCache = new Map<string, string>(); // intakeName -> intakeId
    const sectionCache = new Map<string, string>(); // `${intakeId}:${sectionName}` -> sectionId

    for (const student of students) {
      try {
        const intakeName = student.intakeName?.trim();
        const sectionName = student.sectionName?.trim();
        const studentName = student.name?.trim();

        if (!intakeName || !sectionName || !studentName) {
          results.errors.push(
            `Skipped line for: ${studentName || 'Unknown Student'} - Missing name, intake, or section`,
          );
          continue;
        }

        // 1. Get or create Intake
        let intakeId = intakeCache.get(intakeName);
        if (!intakeId) {
          let intake = await this.prisma.intake.findFirst({
            where: { name: intakeName, institutionId },
          });
          if (!intake) {
            intake = await this.prisma.intake.create({
              data: {
                name: intakeName,
                institutionId,
                startDate: new Date(),
                status: 'ACTIVE',
              },
            });
          }
          intakeId = intake.id;
          intakeCache.set(intakeName, intakeId);
        }

        // 2. Get or create Section
        const sectionCacheKey = `${intakeId}:${sectionName}`;
        let sectionId = sectionCache.get(sectionCacheKey);
        if (!sectionId) {
          let section = await this.prisma.section.findFirst({
            where: { name: sectionName, intakeId },
          });
          if (!section) {
            section = await this.prisma.section.create({
              data: {
                name: sectionName,
                intakeId,
              },
            });
          }
          sectionId = section.id;
          sectionCache.set(sectionCacheKey, sectionId);
        }

        // 3. Find if student already exists by email, or username/studentId
        let user: any = null;
        if (student.email?.trim()) {
          user = await this.prisma.user.findUnique({
            where: { email: student.email.trim() },
          });
        }
        if (!user && student.studentId?.trim()) {
          user = await this.prisma.user.findFirst({
            where: {
              username: student.studentId.trim(),
              institutionId,
            },
          });
        }

        const rawPassword = '1234';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const [firstName, ...lastNameParts] = studentName.split(' ');
        const lastName = lastNameParts.join(' ');

        if (!user) {
          // Create new student
          let username = student.studentId?.trim();
          if (!username) {
            const base = studentName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '.')
              .replace(/\.+/g, '.');
            username = base;
            let count = 1;
            while (true) {
              const existing = await this.prisma.user.findFirst({
                where: { username, institutionId },
              });
              if (!existing) {
                break;
              }
              username = `${base}${count}`;
              count++;
            }
          }

          await this.prisma.user.create({
            data: {
              email: student.email?.trim() || null,
              username,
              password: hashedPassword,
              firstName: firstName || 'Student',
              lastName: lastName || '',
              role: 'STUDENT',
              institutionId,
              sectionId,
            },
          });
          results.added++;
        } else {
          // Update existing student
          if (user.role === 'STUDENT') {
            const csvEmail = student.email?.trim();
            const csvUsername = student.studentId?.trim();
            const csvFirstName = firstName || 'Student';
            const csvLastName = lastName || '';

            const isEmailMatch =
              !csvEmail ||
              (user.email || '').toLowerCase() === csvEmail.toLowerCase();
            const isUsernameMatch =
              !csvUsername ||
              (user.username || '').toLowerCase() === csvUsername.toLowerCase();
            const isFirstNameMatch =
              (user.firstName || '').toLowerCase() ===
              csvFirstName.toLowerCase();
            const isLastNameMatch =
              (user.lastName || '').toLowerCase() === csvLastName.toLowerCase();

            if (
              isEmailMatch &&
              isUsernameMatch &&
              isFirstNameMatch &&
              isLastNameMatch
            ) {
              // Skip the duplicate student completely
              continue;
            }

            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                sectionId,
                institutionId,
              },
            });
            results.added++;
          } else {
            results.errors.push(
              `User ${student.email || student.studentId || 'unknown'} exists but is not a student`,
            );
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(
          `Failed to add ${student.name || 'Unknown Student'}: ${message}`,
        );
      }
    }

    return results;
  }
}
