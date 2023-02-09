import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page: number;

  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset: number;

  @Max(100)
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  count: number;
}
