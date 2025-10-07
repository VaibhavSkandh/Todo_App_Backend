// src/config/env.validation.ts

import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, MinLength, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters long' }) // 👈 Add this
  JWT_SECRET: string;
  
  @IsNumber()
  BCRYPT_SALT_ROUNDS: number;

  @IsString()
  JWT_ACCESS_TOKEN_EXPIRY: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}