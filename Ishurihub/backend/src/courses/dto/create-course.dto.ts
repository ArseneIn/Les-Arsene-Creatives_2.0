export class CreateCourseDto {
  subjectId: string;
  teacherId: string;
  classId: string;
  academicYearId: string;
  credits?: number;
  schoolId: string;
}
