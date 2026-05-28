import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('requirements')
export class RequirementsController {
  constructor(private prisma: PrismaService) {}

  @Get('section/:sectionId')
  async getSectionRequirements(@Param('sectionId') sectionId: string) {
    return this.prisma.stageRequirement.findMany({
      where: { sectionId }
    });
  }

  @Post('section/:sectionId')
  async upsertSectionRequirement(
    @Param('sectionId') sectionId: string,
    @Body() body: { stageId: string; wpm: number; accuracy: number }
  ) {
    const { stageId, wpm, accuracy } = body;
    return this.prisma.stageRequirement.upsert({
      where: { sectionId_stageId: { sectionId, stageId } },
      update: { wpm, accuracy },
      create: { sectionId, stageId, wpm, accuracy }
    });
  }

  @Get('student/:studentId')
  async getStudentOverrides(@Param('studentId') studentId: string) {
    return this.prisma.studentStageRequirementOverride.findMany({
      where: { studentId }
    });
  }

  @Post('student/:studentId')
  async upsertStudentOverride(
    @Param('studentId') studentId: string,
    @Body() body: { stageId: string; wpm: number; accuracy: number }
  ) {
    const { stageId, wpm, accuracy } = body;
    return this.prisma.studentStageRequirementOverride.upsert({
      where: { studentId_stageId: { studentId, stageId } },
      update: { wpm, accuracy },
      create: { studentId, stageId, wpm, accuracy }
    });
  }

  @Get('institution/:institutionId')
  async getInstitutionRequirements(@Param('institutionId') institutionId: string) {
    const firstSection = await this.prisma.section.findFirst({
      where: {
        intake: {
          institutionId
        }
      }
    });

    if (!firstSection) {
      return [];
    }

    return this.prisma.stageRequirement.findMany({
      where: { sectionId: firstSection.id }
    });
  }

  @Post('institution/:institutionId')
  async upsertInstitutionRequirements(
    @Param('institutionId') institutionId: string,
    @Body() body: { stageId: string; wpm: number; accuracy: number }
  ) {
    const { stageId, wpm, accuracy } = body;
    
    // 1. Find all sections in this institution
    const sections = await this.prisma.section.findMany({
      where: {
        intake: {
          institutionId
        }
      }
    });

    // 2. Upsert StageRequirement for each section
    const upserts = sections.map(section => 
      this.prisma.stageRequirement.upsert({
        where: { sectionId_stageId: { sectionId: section.id, stageId } },
        update: { wpm, accuracy },
        create: { sectionId: section.id, stageId, wpm, accuracy }
      })
    );

    return Promise.all(upserts);
  }
}

