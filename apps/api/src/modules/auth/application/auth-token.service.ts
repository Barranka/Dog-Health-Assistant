import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';

import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import type { JwtAuthenticatedUser } from '../domain/jwt-authenticated-user.js';

export interface AuthTokenResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

@Injectable()
export class AuthTokenService {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  async signUser(user: AuthenticatedUser): Promise<AuthTokenResult> {
    const secret = process.env.JWT_SECRET;
    const rawExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
    const expiresIn = rawExpiresIn as NonNullable<JwtSignOptions['expiresIn']>;

    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured.');
    }

    const payload: JwtAuthenticatedUser = {
      sub: user.id,
      telegramId: user.telegramId,
    };

    const signOptions: JwtSignOptions = {
      secret,
      expiresIn,
    };

    const accessToken = await this.jwtService.signAsync(payload, signOptions);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: rawExpiresIn,
    };
  }

  async verifyToken(accessToken: string): Promise<JwtAuthenticatedUser> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured.');
    }

    return this.jwtService.verifyAsync<JwtAuthenticatedUser>(accessToken, {
      secret,
    });
  }
}
