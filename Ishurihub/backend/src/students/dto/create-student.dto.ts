export class CreateStudentDto {
  name: string;
  studentId: string;
  grade: string;
  cardUid?: string;
  section?: string;
  status?: string;
  level?: string;
  year?: string;
  combination?: string;
  dob?: string;
  gender?: string;
  guardians?: {
    name: string;
    relation: string;
    phone: string;
    email?: string;
  }[];
  fatherName?: string;
  motherName?: string;
  primaryPhone?: string;
  emergencyPhone?: string;
  email?: string;
  avatarUrl?: string;
  schoolId: string;
}
