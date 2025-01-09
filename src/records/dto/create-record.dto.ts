import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
}
