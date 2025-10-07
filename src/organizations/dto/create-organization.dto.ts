// src/organizations/dto/create-organization.dto.ts

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'My Awesome Org',
    description: 'The name of the new organization',
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsString()
  @IsNotEmpty()
  orgName: string;
}