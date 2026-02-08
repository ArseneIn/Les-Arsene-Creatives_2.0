import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { UpdateSchoolDto, CreateSchoolDto } from './dto/update-school.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    private usersService: UsersService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    // 1. Create the School
    const school = this.schoolsRepository.create(createSchoolDto);
    const savedSchool = await this.schoolsRepository.save(school);

    // 2. Create Admin User if provided
    if (createSchoolDto.adminEmail && createSchoolDto.adminPassword) {
      await this.usersService.create({
        email: createSchoolDto.adminEmail,
        password: createSchoolDto.adminPassword,
        name: createSchoolDto.adminName || 'School Admin',
        roleId: 'school_admin',
        schoolId: savedSchool.id,
      });
    }

    return savedSchool;
  }

  async findAll() {
    return this.schoolsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const school = await this.schoolsRepository.findOneBy({ id });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    await this.schoolsRepository.update(id, updateSchoolDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const school = await this.findOne(id);
    return this.schoolsRepository.remove(school);
  }
}
