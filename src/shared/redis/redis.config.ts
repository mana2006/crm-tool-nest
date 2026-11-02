import Redis from 'ioredis';

export const redisConnectionBase = (url: string) => {
  const u = new URL(url);
  return new Redis({
    host: u.hostname,
    port: Number(u.port) || 6379,
    username: u.username || undefined,
    password: u.password || undefined,
    tls: u.protocol === 'rediss:' ? {} : undefined,
  });
};
