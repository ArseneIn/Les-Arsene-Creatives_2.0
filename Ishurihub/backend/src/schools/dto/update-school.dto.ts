import { PartialType } from '@nestjs/mapped-types';

export class CreateSchoolDto {
  name: string;
  motto?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  levels?: string[];
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  genderType?: string;
  logoUrl?: string;
  plan?: string;
  features?: string[];
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
  combinations?: { name: string; isActive: boolean }[];
}

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}
