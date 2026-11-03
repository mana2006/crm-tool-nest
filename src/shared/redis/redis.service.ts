import { REDIS_CLIENT } from '@/shared/redis/redis.provider';
import { Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) return await this.client.set(key, value, 'EX', ttlSeconds);

    return await this.client.set(key, value);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.set(key, jsonString, ttlSeconds);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async getDel(key: string): Promise<string | null> {
    return await this.client.getdel(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
