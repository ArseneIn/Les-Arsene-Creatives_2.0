import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { UpdateSchoolDto, CreateSchoolDto } from './dto/update-school.dto';
import { UsersService } from '../users/users.service';
import { DEFAULT_PLAN, PLAN_FEATURES } from '../subscriptions/constants/plan-features.constant';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    private usersService: UsersService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    // 1. Create the School
    const plan = createSchoolDto.plan || DEFAULT_PLAN;
    const features = PLAN_FEATURES[plan] || PLAN_FEATURES[DEFAULT_PLAN];

    const school = this.schoolsRepository.create({
      ...createSchoolDto,
      plan,
      features,
    });
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
    const school = await this.findOne(id);

    // If plan is being updated, sync features
    if (updateSchoolDto.plan && updateSchoolDto.plan !== school.plan) {
      updateSchoolDto.features =
        PLAN_FEATURES[updateSchoolDto.plan] || PLAN_FEATURES[DEFAULT_PLAN];
    }

    // Filter out fields that don't belong to the School entity
    // Destructure out admin fields that are in the DTO but not the entity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adminName, adminEmail, adminPassword, ...schoolData } = updateSchoolDto;

    await this.schoolsRepository.update(id, schoolData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const school = await this.findOne(id);
    return this.schoolsRepository.remove(school);
  }
}
