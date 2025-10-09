// src/auth/dto/login.dto.ts

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The user\'s password',
  })

  @IsString()
  @IsNotEmpty()
  password: string;
}