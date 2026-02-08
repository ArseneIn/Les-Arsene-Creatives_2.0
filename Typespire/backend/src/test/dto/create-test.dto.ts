import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(10)
  @IsOptional()
  duration?: number; // in seconds, default 60

  @IsString()
  @IsOptional()
  difficulty?: string; // EASY, MEDIUM, HARD

  @IsUUID()
  @IsOptional()
  institutionId?: string; // Null for global tests
}
