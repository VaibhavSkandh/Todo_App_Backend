// src/users/dto/update-user.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Allow, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @Allow()
  hashedRefreshToken?: string | null;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsString()
  @IsOptional()
  @Allow()
  emailVerificationToken?: string | null;

  @IsString()
  @IsOptional()
  @Allow()
  passwordResetToken?: string | null;

  @IsDate()
  @IsOptional()
  @Allow()
  passwordResetExpires?: Date | null;

  @IsString()
  @IsOptional()
  passwordHash?: string | null;
}