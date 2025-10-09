// src/users/dto/update-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'newusername',
    description: 'The new username for the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  // You can add other fields a user can update here, like a bio or full name.
}