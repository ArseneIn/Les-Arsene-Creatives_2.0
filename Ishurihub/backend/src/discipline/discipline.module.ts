import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';
import { DisciplineRecord } from './entities/discipline.entity';

import { Student } from '../students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DisciplineRecord, Student])],
  controllers: [DisciplineController],
  providers: [DisciplineService],
})
export class DisciplineModule {}
