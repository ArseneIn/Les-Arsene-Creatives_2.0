import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { School } from '../schools/entities/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, School])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export service for AuthModule
})
export class UsersModule {}
