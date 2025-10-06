// src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  const mockUser = {
    userID: 1,
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedpassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.create(createUserDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ email: createUserDto.email }, { username: createUserDto.username }],
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toEqual(createUserDto.email);
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});