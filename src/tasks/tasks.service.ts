// src/tasks/tasks.service.ts

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, listID, parentTaskID } = createTaskDto;

    const list = await this.listRepository.findOne({
      where: { listID },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException(`List with ID #${listID} not found.`);
    }

    if (list.owner.userID !== user.userID) {
      throw new ForbiddenException('You can only add tasks to your own lists.');
    }

    let parentTask: Task | null = null;
    if (parentTaskID) {
      parentTask = await this.taskRepository.findOneBy({ taskID: parentTaskID });
      if (!parentTask) {
        throw new NotFoundException(
          `Parent task with ID #${parentTaskID} not found.`,
        );
      }
    }

    const newTask = this.taskRepository.create({
      title,
      description,
      list,
      createdBy: user,
      updatedBy: user,
      parentTask,
    });

    return this.taskRepository.save(newTask);
  }

  async findAll(listID: number, user: User): Promise<Task[]> {
    const list = await this.listRepository.findOne({
      where: { listID },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException(`List with ID #${listID} not found.`);
    }

    if (list.owner.userID !== user.userID) {
      throw new ForbiddenException(
        'You are not allowed to view tasks from this list.',
      );
    }

    return this.taskRepository.find({ where: { list: { listID } } });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { taskID: id },
      relations: ['list', 'list.owner'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID #${id} not found.`);
    }

    if (task.list.owner.userID !== user.userID) {
      throw new ForbiddenException('You are not allowed to view this task.');
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    Object.assign(task, updateTaskDto);
    task.updatedBy = user;

    return this.taskRepository.save(task);
  }

  async remove(id: number, user: User): Promise<Task> {
    const task = await this.findOne(id, user); 

    return this.taskRepository.softRemove(task);
  }
}