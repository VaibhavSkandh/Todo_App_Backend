// src/tasks/dto/create-task.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the task',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Milk, bread, and eggs',
    description: 'A detailed description of the task',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the list this task belongs to',
  })
  @IsInt()
  listID: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the parent task if this is a subtask',
  })
  @IsInt()
  @IsOptional()
  parentTaskID?: number;
}