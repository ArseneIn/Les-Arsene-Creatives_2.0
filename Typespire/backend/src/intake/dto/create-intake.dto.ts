import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateIntakeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string; // ISO Date string

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsUUID()
  @IsNotEmpty()
  institutionId: string;
}
