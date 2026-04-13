import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { School } from '../schools/entities/school.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@ishurihub.rw';
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log('Seeding default super admin...');

      // We need a school to assign the admin to.
      let school = await this.schoolsRepository.findOne({ where: {} });

      if (!school) {
        console.log('No school found, creating a default one for the admin...');
        school = this.schoolsRepository.create({
          name: 'IshuriHub System Office',
          location: 'Remote',
          email: 'system@ishurihub.rw',
          plan: 'Professional',
          subscriptionStatus: 'Active',
        });
        school = await this.schoolsRepository.save(school);
      }

      await this.create({
        email: adminEmail,
        password: 'password123',
        name: 'Super Admin',
        roleId: 'super_admin',
        schoolId: school.id,
        avatarUrl:
          'https://ui-avatars.com/api/?name=Super+Admin&background=000000&color=fff',
      });
      console.log('Default super admin created.');
    }
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['customRole', 'school'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Validation: EVERY user must be affiliated with an institution.
    if (!userData.schoolId) {
      throw new BadRequestException(
        'Every user must be affiliated with an institution.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      userData.password || 'default',
      salt,
    );

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(schoolId?: string): Promise<User[]> {
    const whereCondition = schoolId ? { schoolId } : {};
    return this.usersRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      relations: ['customRole', 'school'],
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validation: EVERY user must be affiliated with an institution.
    const finalSchoolId =
      updateData.schoolId !== undefined ? updateData.schoolId : user.schoolId;

    if (!finalSchoolId) {
      throw new BadRequestException(
        'Every user must be affiliated with an institution.',
      );
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
