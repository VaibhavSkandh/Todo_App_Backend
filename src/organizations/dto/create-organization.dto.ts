// src/organizations/dto/create-organization.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;
}
