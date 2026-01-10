import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}
