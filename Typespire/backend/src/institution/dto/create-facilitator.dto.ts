export class CreateFacilitatorDto {
  email: string;
  firstName: string;
  lastName: string;
  role?: string; // Optional, defaults to FACILITATOR
}
