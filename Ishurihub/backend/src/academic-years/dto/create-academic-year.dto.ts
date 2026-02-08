export class CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  schoolId: string;
  isActive?: boolean;
}
