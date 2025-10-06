// src/auth/jwt-refresh.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh', 
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'), 
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.body.refresh_token;
    const user = await this.usersService.findOne(payload.sub);

    if (user && user.hashedRefreshToken && await bcrypt.compare(refreshToken, user.hashedRefreshToken)) {
      return user;
    }

    return null;
  }
}