// src/users/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { AuthProvider } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'testuser',
    description: 'The unique username for the user',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The user password (must be strong)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain an uppercase letter, a lowercase letter, a number, and a special character',
    },
  )
  password?: string;

  @IsOptional()
  authProvider?: AuthProvider;
}