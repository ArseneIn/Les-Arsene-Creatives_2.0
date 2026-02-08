import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async onModuleInit() {
    const adminEmail = 'admin@ishurihub.rw';
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });
    if (!existingAdmin) {
      console.log('Seeding default super admin...');
      await this.create({
        email: adminEmail,
        password: 'password123',
        name: 'Super Admin',
        roleId: 'super_admin',
        schoolId: null, // System level
        avatarUrl:
          'https://ui-avatars.com/api/?name=Super+Admin&background=000000&color=fff',
      });
      console.log('Default super admin created.');
    }
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['customRole'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
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
      relations: ['customRole'],
    });
  }
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
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
