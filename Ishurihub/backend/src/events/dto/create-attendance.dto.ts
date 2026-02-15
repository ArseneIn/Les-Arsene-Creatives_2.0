import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttendanceStatus } from '../entities/event-attendance.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
