import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    // Case 1: User is not found in the database
    if (!user) {
      console.error('VALIDATION FAILED: User not found for email:', email);
      return null;
    }

    // Case 2: User is found, but the password hash is missing.
    if (!user.passwordHash) {
      console.error('VALIDATION FAILED: User found, but passwordHash is missing.');
      return null;
    }

    // Case 3: Passwords are compared.
    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (isMatch) {
      // Success!
      const { passwordHash, ...result } = user;
      return result;
    } else {
      // Failure!
      console.error('VALIDATION FAILED: Passwords do not match.');
      return null;
    }
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userID };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}