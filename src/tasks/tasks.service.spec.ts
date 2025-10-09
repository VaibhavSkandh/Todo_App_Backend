// src/tasks/tasks.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { List } from 'src/lists/entities/list.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

// --- Mock Data ---
const mockUser: User = {
  userID: 1,
  username: 'testuser',
  role: UserRole.USER,
} as User;

const anotherUser: User = {
  userID: 99,
  username: 'anotheruser',
  role: UserRole.USER,
} as User;

const mockList: List = {
  listID: 1,
  listName: 'My List',
  owner: mockUser,
} as List;

const mockTask: Task = {
  taskID: 1,
  title: 'My Task',
  list: mockList,
} as Task;

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let listRepository: Repository<List>;

  // --- Test Setup ---
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockResolvedValue([mockTask]),
            findOne: jest.fn().mockResolvedValue(mockTask),
            softRemove: jest.fn().mockResolvedValue(mockTask),
          },
        },
        {
          provide: getRepositoryToken(List),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockList),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Tests for the 'create' method ---
  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'New Task',
      listID: 1,
    };

    it('should create a task successfully', async () => {
      const result = await service.create(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      expect(listRepository.findOne).toHaveBeenCalledWith({
        where: { listID: 1 },
        relations: ['owner'],
      });
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if the list does not exist', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValue(null);
      await expect(service.create(createTaskDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if the user does not own the list', async () => {
      jest.spyOn(listRepository, 'findOne').mockResolvedValue({ ...mockList, owner: anotherUser });
      await expect(service.create(createTaskDto, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // --- Tests for the 'findOne' method ---
  describe('findOne', () => {
    it('should return a task if the user owns the list it belongs to', async () => {
      const result = await service.findOne(1, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw a ForbiddenException if the user does not own the list', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue({
        ...mockTask,
        list: { ...mockList, owner: anotherUser },
      });
      await expect(service.findOne(1, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});