export class CreateSubscriptionDto {
  schoolId: string;
  plan: string;
  amount: number;
  billingCycle: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
