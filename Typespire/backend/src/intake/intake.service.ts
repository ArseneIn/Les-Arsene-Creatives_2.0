import { Injectable } from '@nestjs/common';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntakeService {
  constructor(private prisma: PrismaService) { }

  create(createIntakeDto: CreateIntakeDto) {
    return this.prisma.intake.create({
      data: {
        ...createIntakeDto,
        startDate: new Date(createIntakeDto.startDate),
        endDate: createIntakeDto.endDate
          ? new Date(createIntakeDto.endDate)
          : null,
      },
    });
  }

  findAll(institutionId?: string) {
    return this.prisma.intake.findMany({
      where: institutionId ? { institutionId } : {},
      include: {
        institution: true,
        sections: {
          include: {
            students: true,
            facilitator: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.intake.findUnique({
      where: { id },
      include: { institution: true, sections: true },
    });
  }

  update(id: string, updateIntakeDto: UpdateIntakeDto) {
    const { startDate, endDate, ...rest } = updateIntakeDto;
    return this.prisma.intake.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.intake.delete({
      where: { id },
    });
  }
}
