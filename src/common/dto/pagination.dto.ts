// src/common/dto/pagination.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'The number of items to retrieve per page',
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit: number = 10;
}