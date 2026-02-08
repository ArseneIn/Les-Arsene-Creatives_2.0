export class CreateClassDto {
  name: string;
  year: string;
  level: string;
  stream?: string;
  capacity?: number;
  schoolId: string;
}
