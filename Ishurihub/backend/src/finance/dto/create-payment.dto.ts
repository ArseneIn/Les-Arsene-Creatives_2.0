export class CreatePaymentDto {
  schoolId: string;
  studentName: string;
  studentId: string;
  amount: number;
  type: string;
  date: string;
  status: string;
  method: string;
}
