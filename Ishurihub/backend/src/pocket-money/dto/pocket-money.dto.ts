export class CreatePocketMoneyAccountDto {
  studentId: string;
  schoolId: string;
  currency?: string;
  dailySpendingLimit?: number;
}

export class DepositDto {
  studentId: string;
  amount: number;
  description?: string;
  reference?: string;
  paymentMethod?: string;
  performedBy?: string;
  schoolId: string;
}

export class WithdrawDto {
  studentId: string;
  amount: number;
  description?: string;
  reference?: string;
  paymentMethod?: string;
  performedBy?: string;
  schoolId: string;
}

export class UpdateLimitDto {
  dailySpendingLimit: number;
}
