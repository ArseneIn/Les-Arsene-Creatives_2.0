import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';
import { EventType, TargetAudience } from '../entities/school-event.entity';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsEnum(EventType)
    eventType: EventType;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    startTime: string;

    @IsOptional()
    @IsString()
    endTime: string;

    @IsBoolean()
    isRecurring: boolean;

    @IsOptional()
    recurrencePattern: any;

    @IsNotEmpty()
    startDate: string;

    @IsOptional()
    endDate: string;

    @IsBoolean()
    isMandatory: boolean;

    @IsEnum(TargetAudience)
    targetAudience: TargetAudience;

    @IsOptional()
    @IsArray()
    targetIds: string[];
}
