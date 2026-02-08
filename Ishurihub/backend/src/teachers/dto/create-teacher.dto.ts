export class CreateTeacherDto {
  name: string;
  email: string;
  subject: string;
  classes?: string[];
  phone?: string;
  status?: string;
  avatarUrl?: string;
  joinedDate?: string;
  schoolId: string;
}
