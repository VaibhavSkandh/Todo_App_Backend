// src/lists/dto/create-list.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export class CreateListDto {
  @ApiProperty({
    example: 'Groceries',
    description: 'The name of the new list',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsString()
  @IsNotEmpty()
  listName: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the organization this list belongs to (optional)',
  })
  @IsNumber()
  @IsOptional()
  organizationID?: number;
}