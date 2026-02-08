import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Term } from './entities/term.entity';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateTermDto } from './dto/create-term.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private yearsRepository: Repository<AcademicYear>,
    @InjectRepository(Term)
    private termsRepository: Repository<Term>,
  ) { }

  async createYear(dto: CreateAcademicYearDto) {
    if (dto.isActive) {
      await this.deactivateAllYears(dto.schoolId);
    }
    const year = this.yearsRepository.create(dto);
    return this.yearsRepository.save(year);
  }

  async createTerm(dto: CreateTermDto) {
    if (dto.isActive) {
      // Find the parent year to get schoolId if needed, or just deactivate all terms in this year
      // For global "Active Term", we might want to deactivate ALL terms for the school, but usually it's per year.
      // Let's assume only one term is active globally (current term).
      const year = await this.yearsRepository.findOne({
        where: { id: dto.academicYearId },
      });
      if (year) {
        await this.deactivateAllTerms(year.schoolId);
      }
    }
    const term = this.termsRepository.create(dto);
    return this.termsRepository.save(term);
  }

  async findAllYears(schoolId: string) {
    return this.yearsRepository.find({
      where: { schoolId },
      relations: ['terms'],
      order: { startDate: 'DESC' },
    });
  }

  async setActiveYear(id: string, schoolId: string) {
    await this.deactivateAllYears(schoolId);
    await this.yearsRepository.update(id, { isActive: true });
    return { success: true };
  }

  async setActiveTerm(id: string, schoolId: string) {
    await this.deactivateAllTerms(schoolId);
    await this.termsRepository.update(id, { isActive: true });
    return { success: true };
  }

  async findActiveTerm(schoolId: string): Promise<Term | null> {
    return this.termsRepository
      .createQueryBuilder('term')
      .innerJoinAndSelect('term.academicYear', 'year')
      .where('term.isActive = :isActive', { isActive: true })
      .andWhere('year.schoolId = :schoolId', { schoolId })
      .getOne();
  }

  private async deactivateAllYears(schoolId: string) {
    await this.yearsRepository.update({ schoolId }, { isActive: false });
  }

  private async deactivateAllTerms(schoolId: string) {
    const years = await this.yearsRepository.find({
      where: { schoolId },
      select: ['id'],
    });
    const yearIds = years.map((y) => y.id);

    if (yearIds.length > 0) {
      await this.termsRepository
        .createQueryBuilder()
        .update(Term)
        .set({ isActive: false })
        .where('academicYearId IN (:...yearIds)', { yearIds })
        .execute();
    }
  }
}
