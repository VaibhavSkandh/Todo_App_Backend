// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Here we map the incoming request fields to what passport-local expects ('username' and 'password')
    super({ usernameField: 'email' });
  }

  /**
   * Passport automatically calls this method when the LocalAuthGuard is used.
   * It takes the credentials from the request body and validates them.
   * @param email The email from the request body
   * @param password The password from the request body
   * @returns The user object if validation is successful
   * @throws UnauthorizedException if validation fails
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
