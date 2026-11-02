import { Env } from '@/config/envs';
import { redisConnectionBase } from '@/shared/redis/redis.config';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService<Env, true>) => {
    return redisConnectionBase(config.get('REDIS_URL', { infer: true }));
  },
};
