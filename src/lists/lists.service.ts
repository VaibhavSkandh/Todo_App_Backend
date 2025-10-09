// src/lists/lists.service.ts

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './../../src/organizations/entities/organization.entity';
import { User } from './../../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(createListDto: CreateListDto, user: User): Promise<List> {
    const { listName, organizationID } = createListDto;
    let organization: Organization | null = null;

    if (organizationID) {
      const foundOrg = await this.organizationRepository.findOne({
        where: { organizationID },
        relations: ['owner'],
      });

      if (!foundOrg) {
        throw new NotFoundException(
          `Organization with ID #${organizationID} not found.`,
        );
      }

      if (foundOrg.owner.userID !== user.userID) {
        throw new ForbiddenException(
          'You are not allowed to add lists to this organization.',
        );
      }
      organization = foundOrg;
    }

    const newList = this.listRepository.create({
      listName,
      owner: user,
      organization: organization,
    });

    return this.listRepository.save(newList);
  }

  findAll(user: User): Promise<List[]> {
    return this.listRepository.find({
      where: { owner: { userID: user.userID } },
    });
  }

  async findOne(id: number, user: User): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { listID: id },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException(`List with ID #${id} not found.`);
    }

    if (list.owner.userID !== user.userID) {
      throw new ForbiddenException('You are not allowed to view this list.');
    }

    return list;
  }

  // 👇 This method is now implemented
  async update(id: number, updateListDto: UpdateListDto, user: User): Promise<List> {
    const list = await this.findOne(id, user); // findOne already performs the ownership check
    
    Object.assign(list, updateListDto);
    
    return this.listRepository.save(list);
  }

  // 👇 This method is now implemented
  async remove(id: number, user: User): Promise<List> {
    const list = await this.findOne(id, user); // findOne already performs the ownership check

    return this.listRepository.softRemove(list);
  }
}