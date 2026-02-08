export class CreateDisciplineDto {
  studentId: string;
  type: string;
  category: string;
  description: string;
  date: string;
  reportedBy: string;
  severity?: string;
  points?: number;
  status?: string;
  actionTaken?: string;
  schoolId: string;
}
