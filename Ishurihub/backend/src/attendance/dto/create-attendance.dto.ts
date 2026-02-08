export class CreateAttendanceDto {
  studentId: string;
  teacherId?: string;
  date: string;
  status: string;
  remarks?: string;
  schoolId: string;
}
