import { RedisOptions } from 'ioredis';

/**
 * Connection settings that can safely be passed to BullMQ or used to create an
 * application Redis client.  Do not return a Redis instance here: BullMQ owns
 * the clients it creates and closes them when Nest shuts down.
 */
export const redisConnectionBase = (url: string): RedisOptions => {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port) || 6379,
    username: u.username || undefined,
    password: u.password || undefined,
    tls: u.protocol === 'rediss:' ? {} : undefined,
  };
};
