// src/organizations/organizations.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
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

    // This is no longer strictly needed in this service after our refactor,
    // but can be useful if you add other methods that need to look up users.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new organization and assigns the authenticated user as the owner.
   */
  async create(createOrganizationDto: CreateOrganizationDto, user: User): Promise<Organization> {
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
   */
  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
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
   * Removes an organization.
   */
  async remove(id: number): Promise<Organization> {
    const organization = await this.findOne(id);
    return this.organizationRepository.remove(organization);
  }
}