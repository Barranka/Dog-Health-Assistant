import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import type { TelegramAuthUser } from '../domain/telegram-auth-user.js';

interface TelegramMiniAppUserPayload {
  id: number;
  first_name?: string | undefined;
  username?: string | undefined;
}

interface TelegramLoginPayload {
  id: number | string;
  first_name?: string | undefined;
  username?: string | undefined;
  auth_date: number | string;
  hash: string;
}

@Injectable()
export class TelegramAuthService {
  verifyMiniAppInitData(initData: string): TelegramAuthUser {
    const botToken = this.getTelegramBotToken();
    const params = new URLSearchParams(initData);
    const receivedHash = params.get('hash');
    const authDate = this.parseAuthDate(params.get('auth_date'));
    const rawUser = params.get('user');

    if (!receivedHash || !rawUser) {
      throw new UnauthorizedException('Invalid Telegram Mini App initData.');
    }

    this.assertAuthDateIsFresh(authDate);

    const dataCheckString = this.buildDataCheckString(params, ['hash']);
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    this.assertHashMatches(calculatedHash, receivedHash);

    const userPayload = this.parseMiniAppUser(rawUser);

    return {
      telegramId: String(userPayload.id),
      firstName: userPayload.first_name ?? null,
      username: userPayload.username ?? null,
      authDate,
    };
  }

  verifyTelegramLogin(payload: TelegramLoginPayload): TelegramAuthUser {
    const botToken = this.getTelegramBotToken();
    const authDate = this.parseAuthDate(payload.auth_date);

    this.assertAuthDateIsFresh(authDate);

    const dataCheckString = this.buildObjectDataCheckString({ ...payload }, ['hash']);
    const secretKey = createHash('sha256').update(botToken).digest();
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    this.assertHashMatches(calculatedHash, payload.hash);

    return {
      telegramId: String(payload.id),
      firstName: payload.first_name ?? null,
      username: payload.username ?? null,
      authDate,
    };
  }

  private getTelegramBotToken(): string {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new UnauthorizedException('TELEGRAM_BOT_TOKEN is not configured.');
    }

    return botToken;
  }

  private parseMiniAppUser(rawUser: string): TelegramMiniAppUserPayload {
    try {
      const parsed = JSON.parse(rawUser) as Partial<TelegramMiniAppUserPayload>;

      if (!parsed.id) {
        throw new UnauthorizedException('Telegram user id is missing.');
      }

      const miniAppUser: TelegramMiniAppUserPayload = {
        id: parsed.id,
      };

      if (parsed.first_name) {
        miniAppUser.first_name = parsed.first_name;
      }

      if (parsed.username) {
        miniAppUser.username = parsed.username;
      }

      return miniAppUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Telegram user payload is invalid.');
    }
  }

  private parseAuthDate(value: number | string | null): Date {
    const rawAuthDate = Number(value);

    if (!Number.isFinite(rawAuthDate)) {
      throw new UnauthorizedException('Telegram auth_date is invalid.');
    }

    return new Date(rawAuthDate * 1000);
  }

  private assertAuthDateIsFresh(authDate: Date): void {
    const maxAgeSeconds = Number(process.env.TELEGRAM_AUTH_MAX_AGE_SECONDS ?? 86_400);
    const ageSeconds = Math.floor((Date.now() - authDate.getTime()) / 1000);

    if (ageSeconds < 0 || ageSeconds > maxAgeSeconds) {
      throw new UnauthorizedException('Telegram auth data has expired.');
    }
  }

  private buildDataCheckString(params: URLSearchParams, excludedKeys: string[]): string {
    return [...params.entries()]
      .filter(([key]) => !excludedKeys.includes(key))
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  private buildObjectDataCheckString(
    payload: Record<string, number | string | undefined>,
    excludedKeys: string[],
  ): string {
    return Object.entries(payload)
      .filter(([key, value]) => !excludedKeys.includes(key) && value !== undefined)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }

  private assertHashMatches(calculatedHash: string, receivedHash: string): void {
    const calculated = Buffer.from(calculatedHash, 'hex');
    const received = Buffer.from(receivedHash, 'hex');

    if (calculated.length !== received.length || !timingSafeEqual(calculated, received)) {
      throw new UnauthorizedException('Telegram signature is invalid.');
    }
  }
}
