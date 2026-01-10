import { IsString, IsNotEmpty } from 'class-validator';

export class SendReminderDto {
  @IsString()
  @IsNotEmpty()
  shopName: string;
}
