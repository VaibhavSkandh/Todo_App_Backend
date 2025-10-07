// src/users/users.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, AuthProvider } from './entities/user.entity';
import { PaginationDto } from './../../src/common/dto/pagination.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or Email already exists');
    }

    let hashedPassword: string | null = null;
    if (createUserDto.password) {
      // 👇 Provide a default value of 12 for the salt rounds
      const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12);
      hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      passwordHash: hashedPassword,
      authProvider: createUserDto.authProvider || AuthProvider.EMAIL,
      emailVerificationToken: verificationToken,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      select: {
        userID: true,
        email: true,
        username: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: skip,
      take: limit,
      order: {
        userID: 'ASC',
      },
    });

    return {
      data: users,
      meta: {
        totalItems: total,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userID: id });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findOneByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ emailVerificationToken: token });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .getOne();
  }

  async findOneByPasswordResetToken(hashedToken: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: MoreThan(new Date()),
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
    currentUser: User,
  ): Promise<User> {
    if (currentUser.userID !== id) {
      throw new ForbiddenException(
        'You are only allowed to update your own profile.',
      );
    }
    const user = await this.findOne(id);
    Object.assign(user, updateProfileDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number, currentUser: User): Promise<User> {
    if (currentUser.userID !== id) {
      throw new ForbiddenException(
        'You are only allowed to delete your own profile.',
      );
    }
    const user = await this.findOne(id);
    return this.usersRepository.softRemove(user);
  }
}