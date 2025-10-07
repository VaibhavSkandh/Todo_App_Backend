// src/auth/dto/forgot-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address to send the password reset link to',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}