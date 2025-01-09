import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateRecordDto } from './create-record.dto';

export class CreateMultipleRecordDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordDto)
  @IsNotEmpty()
  records: CreateRecordDto[];
}
