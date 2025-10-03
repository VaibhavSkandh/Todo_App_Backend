// src/organizations/organizations.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new organization and assigns the authenticated user as the owner.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
    user: User,
  ): Promise<Organization> {
    const { orgName } = createOrganizationDto;

    const newOrg = this.organizationRepository.create({
      orgName,
      owner: user, // Assign the user object directly
    });

    return this.organizationRepository.save(newOrg);
  }

  /**
   * Finds all organizations.
   */
  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['owner'], // Optionally include the owner relation
    });
  }

  /**
   * Finds a single organization by its ID.
   */
  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { organizationID: id },
      relations: ['owner'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID #${id} not found`);
    }

    return organization;

  }

  /**
   * Updates an organization's data.
   * Note: This does not currently have authorization logic.
   */
  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.preload({
      organizationID: id,
      ...updateOrganizationDto,
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID #${id} not found`);
    }

    return this.organizationRepository.save(organization);
  }

  /**
   * Removes an organization, but only if the requesting user is the owner.
   */
  async remove(id: number, user: User): Promise<Organization> {
    // First, find the organization
    const organization = await this.findOne(id);

    // Check if the user ID from the token matches the organization's owner's ID
    if (organization.owner.userID !== user.userID) {
      throw new ForbiddenException(
        'You are not allowed to delete this organization.',
      );
    }

    // If the check passes, remove the organization
    return this.organizationRepository.remove(organization);
  }
}