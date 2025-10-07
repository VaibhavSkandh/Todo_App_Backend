// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  Req,

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    await this.authService.sendVerificationEmail(user);
    return {
      message:
        'Signup successful. Please check your email to verify your account.',
    };
  }
  
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify a user\'s email address' })
  @ApiResponse({ status: 200, description: 'Email successfully verified.' })
  @ApiResponse({ status: 400, description: 'Invalid verification token.' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns tokens.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@GetUser() user: Omit<User, 'passwordHash'>) {
    return this.authService.login(user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({
    status: 200,
    description: 'A confirmation message is returned.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  async logout(@GetUser() user: User) {
    return this.authService.logout(user.userID);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  async refreshTokens(@GetUser() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Get the current user\'s profile' })
  @ApiResponse({ status: 200, description: 'User profile data.' })
  getProfile(@GetUser() user: User) {
    return user;
  }
   @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset a user\'s password' })
  @ApiResponse({ status: 200, description: 'Password successfully reset.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
   @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.login(req.user);
  }
}
