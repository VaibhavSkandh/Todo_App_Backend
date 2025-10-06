// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // This configures the strategy to look for the JWT in the Authoriz
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // We will not allow expired tokens
      ignoreExpiration: false,
      // The secret key to verify the token's signature
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Passport first verifies the JWT's signature and expiration, then calls this method.
   * It passes the decoded payload to this method.
   * We simply return the payload, which Passport will attach to the Request object as `req.user`.
   */
  async validate(payload: any) {
    // The payload contains { username: 'testuser', sub: 1, iat: ..., exp: ... }
    return { userID: payload.sub, username: payload.username };
  }
}