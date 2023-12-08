import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UploadedRecordListDto {
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number;

  @IsOptional()
  search?: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number;
}
