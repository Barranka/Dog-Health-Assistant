import { plainToInstance, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min, validateSync } from 'class-validator';

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
  };
}
