import { Env } from '@/config/envs';
import { redisConnectionBase } from '@/shared/redis/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        connection: {
          ...redisConnectionBase(config.get('REDIS_URL', { infer: true })),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          lazyConnect: true,
          keepAlive: 30000,
          retryStrategy(times) {
            if (times > 2) {
              return null;
            }
            return Math.min(times * 100, 2000);
          },
          enableOfflineQueue: false,
        },
      }),
    }),
  ],
})
export class QueueModule {}
