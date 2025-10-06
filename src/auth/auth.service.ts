// src/auth/auth.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 👇 The return type is corrected here to include '| null'
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    this.logger.debug(`Authentication attempt failed for email: ${email}`);
    return null;
  }

  async login(user: Omit<User, 'passwordHash'>) {
    const payload: JwtPayload = { username: user.username, sub: user.userID };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    await this.setCurrentRefreshToken(refreshToken, user.userID);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { hashedRefreshToken: null });
  }
}