import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRecord } from './entities/attendance.entity';
import { AcademicYearsModule } from '../academic-years/academic-years.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord]), AcademicYearsModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
