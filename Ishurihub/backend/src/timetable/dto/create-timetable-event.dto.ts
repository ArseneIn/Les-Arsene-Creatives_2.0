export class CreateTimetableEventDto {
  schoolId: string;
  classId: string;
  day: string;
  periodId: number;
  subject: string;
  teacher: string;
  room: string;
  color?: string;
}
