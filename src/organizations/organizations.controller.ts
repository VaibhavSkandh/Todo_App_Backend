// src/organizations/organizations.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('organizations')
@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Creates a new organization for the currently authenticated user.
   */
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() req) {
    // req.user is populated by our JwtStrategy with { userID, username }
    return this.organizationsService.create(createOrganizationDto, req.user);
  }

  /**
   * Finds all organizations.
   */
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  /**
   * Finds a single organization by its ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  /**
   * Updates an organization.
   * Note: We haven't added ownership authorization to this route yet.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  /**
   * Deletes an organization.
   * Authorization logic is handled in the service.
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // We pass the organization ID and the user object to the service for the ownership check.
    return this.organizationsService.remove(+id, req.user);
  }
}
