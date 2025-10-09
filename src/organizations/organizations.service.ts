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

  async create(
    createOrganizationDto: CreateOrganizationDto,
    user: User,
  ): Promise<Organization> {
    const { orgName } = createOrganizationDto;

    const newOrg = this.organizationRepository.create({
      orgName,
      owner: user,
    });

    return this.organizationRepository.save(newOrg);
  }

  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['owner'],
    });
  }

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

  async remove(id: number, user: User): Promise<Organization> {
    const organization = await this.findOne(id);

    if (organization.owner.userID !== user.userID) {
      throw new ForbiddenException(
        'You are not allowed to delete this organization.',
      );
    }

    return this.organizationRepository.softRemove(organization);
  }
}