import { redisProvider } from '@/shared/redis/redis.provider';
import { RedisService } from '@/shared/redis/redis.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [RedisService, redisProvider],
  exports: [RedisService],
})
export class RedisModule {}
