import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceDto } from './create-attendance.dto';

export class CreateBulkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records: CreateAttendanceDto[];

  @IsNotEmpty()
  classId: string;

  @IsNotEmpty()
  date: string;

  @IsOptional()
  schoolId: string;
}
