// src/lists/lists.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ListsService } from './lists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockUser: User = {
  userID: 1,
  email: 'test@example.com',
  username: 'testuser',
  role: UserRole.USER,
} as User;

const anotherUser: User = {
  userID: 99,
  email: 'another@example.com',
  username: 'anotheruser',
  role: UserRole.USER,
} as User;

const mockOrg: Organization = {
  organizationID: 1,
  orgName: 'Test Org',
  owner: mockUser,
} as Organization;

const mockList: List = {
  listID: 1,
  listName: 'My List',
  owner: mockUser,
} as List;

describe('ListsService', () => {
  let service: ListsService;
  let listRepository: Repository<List>;
  let orgRepository: Repository<Organization>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListsService,
        {
          provide: getRepositoryToken(List),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockList),
            find: jest.fn().mockResolvedValue([mockList]),
            findOne: jest.fn().mockResolvedValue(mockList),
            softRemove: jest.fn().mockResolvedValue(mockList),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockOrg),
          },
        },
      ],
    }).compile();

    service = module.get<ListsService>(ListsService);
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
    orgRepository = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a personal list successfully', async () => {
      const createListDto: CreateListDto = { listName: 'My Personal List' };
      await service.create(createListDto, mockUser);
      expect(listRepository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the organization', async () => {
      const createListDto: CreateListDto = {
        listName: 'My Org List',
        organizationID: 1,
      };
      jest.spyOn(orgRepository, 'findOne').mockResolvedValue({ ...mockOrg, owner: anotherUser });
      await expect(service.create(createListDto, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return an array of lists for the user', async () => {
      const lists = await service.findAll(mockUser);
      expect(lists).toEqual([mockList]);
      expect(listRepository.find).toHaveBeenCalledWith({ where: { owner: { userID: mockUser.userID } } });
    });
  });

  describe('findOne', () => {
    it('should return a single list if the user is the owner', async () => {
      const list = await service.findOne(1, mockUser);
      expect(list).toEqual(mockList);
    });

    it('should throw ForbiddenException if the user is not the owner', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValue({ ...mockList, owner: anotherUser });
      await expect(service.findOne(1, mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if list does not exist', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft remove a list if the user is the owner', async () => {
      await service.remove(1, mockUser);
      expect(listRepository.softRemove).toHaveBeenCalledWith(mockList);
    });

    it('should throw ForbiddenException when trying to remove a list they do not own', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValue({ ...mockList, owner: anotherUser });
      await expect(service.remove(1, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });
});