import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  findAll(schoolId: string) {
    return this.rolesRepository.find({
      where: { schoolId },
      order: { name: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.rolesRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleDto: Partial<CreateRoleDto>) {
    await this.rolesRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.rolesRepository.delete(id);
  }
}
