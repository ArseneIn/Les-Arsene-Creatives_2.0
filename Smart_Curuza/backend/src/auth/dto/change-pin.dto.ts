import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePinDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  oldPin: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  newPin: string;
}
