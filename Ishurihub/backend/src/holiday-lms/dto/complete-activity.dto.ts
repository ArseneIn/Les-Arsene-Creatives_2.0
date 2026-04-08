import { IsUUID, IsArray, IsObject, IsOptional } from 'class-validator';

export class CompleteActivityDto {
  @IsUUID()
  activityId: string;

  @IsOptional()
  @IsObject()
  responses?: Record<string, string>; // Maps questionId to student answer

  @IsOptional()
  @IsArray()
  quizAnswers?: { questionId: string; answer: string }[];
}
