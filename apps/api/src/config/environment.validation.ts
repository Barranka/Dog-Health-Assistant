import { plainToInstance, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

import type { ApiEnvironment } from './environment.js';

class EnvironmentVariables implements ApiEnvironment {
  @IsIn(['development', 'test', 'production'])
  @IsOptional()
  NODE_ENV: ApiEnvironment['NODE_ENV'] = 'development';

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  @Type(() => Number)
  API_PORT = 3000;

  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN = '7d';

  @IsString()
  @IsOptional()
  TELEGRAM_BOT_TOKEN?: string;

  @IsInt()
  @Min(60)
  @Max(2_592_000)
  @IsOptional()
  @Type(() => Number)
  TELEGRAM_AUTH_MAX_AGE_SECONDS = 86_400;
}

export function validateEnvironment(config: Record<string, unknown>): ApiEnvironment {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return {
    NODE_ENV: validatedConfig.NODE_ENV,
    API_PORT: validatedConfig.API_PORT,
    JWT_SECRET: validatedConfig.JWT_SECRET,
    JWT_EXPIRES_IN: validatedConfig.JWT_EXPIRES_IN,
    TELEGRAM_BOT_TOKEN: validatedConfig.TELEGRAM_BOT_TOKEN,
    TELEGRAM_AUTH_MAX_AGE_SECONDS: validatedConfig.TELEGRAM_AUTH_MAX_AGE_SECONDS,
  };
}
