import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Classroom } from './entities/classroom.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, Student])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
