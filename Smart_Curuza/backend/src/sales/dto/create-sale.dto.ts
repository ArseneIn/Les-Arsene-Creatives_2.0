import { IsArray, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsArray()
  items: any[];

  @IsNumber()
  total: number;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;
}
