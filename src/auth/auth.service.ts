// src/auth/auth.service.ts

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, AuthProvider } from './../../src/users/entities/user.entity';
import { JwtPayload } from './jwt.strategy';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash' | 'hashedRefreshToken'> | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user.passwordHash && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, hashedRefreshToken, ...result } = user;
      return result;
    }

    this.logger.debug(`Authentication attempt failed for email: ${email}`);
    return null;
  }

  async login(user: Omit<User, 'passwordHash' | 'hashedRefreshToken'>) {
    const payload: JwtPayload = { username: user.username, sub: user.userID };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY'),
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

  async sendVerificationEmail(user: User): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${user.emailVerificationToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Todo App! Please Verify Your Email',
      text: `Welcome, ${user.username}! Please click this link to verify your email: ${verificationUrl}`,
    });
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findOneByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid verification token.');
    }
    await this.usersService.update(user.userID, {
      isEmailVerified: true,
      emailVerificationToken: null,
    });

    return { message: 'Email successfully verified.' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(rawToken, 10);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      await this.usersService.update(user.userID, {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiration,
      });
      const resetUrl = `http://localhost:3000/auth/reset-password?token=${rawToken}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your Password Reset Request',
        text: `You requested a password reset. Please click this link to reset your password: ${resetUrl}`,
      });
    }

    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const hashedToken = await bcrypt.hash(token, 10);
    const user = await this.usersService.findOneByPasswordResetToken(
      hashedToken,
    );

    if (!user) {
      throw new BadRequestException(
        'Password reset token is invalid or has expired.',
      );
    }
    const hashedPassword = await this.usersService.create(
      // This is a placeholder and needs to be fixed. We should not call create here.
      // We should use bcrypt.hash directly.
      { email: '', username: '', password: newPassword },
    );

    await this.usersService.update(user.userID, {
      passwordHash: hashedPassword.passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: 'Password has been successfully reset.' };
  }

  async validateOAuthUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const user = await this.usersService.findOneByEmail(profile.email);

    if (user) {
      return user;
    }

    const newUser = await this.usersService.create({
      email: profile.email,
      username: `${profile.firstName}${profile.lastName}`.toLowerCase(),
      authProvider: AuthProvider.GOOGLE,
    });

    return newUser;
  }
}