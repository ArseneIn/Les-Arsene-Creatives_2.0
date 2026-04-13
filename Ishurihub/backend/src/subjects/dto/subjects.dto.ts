export class CreateSubjectDto {
  name: string;
  code?: string;
  description?: string;
  department?: string;
  schoolId: string;
}

export class UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string;
  department?: string;
  schoolId?: string;
}
