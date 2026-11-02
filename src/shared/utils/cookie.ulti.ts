import { Env } from '@/config/envs';
import { COOKIES } from '@/shared/constants/auth.constants';
import { CookieKey } from '@/shared/types';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';

export const calculateTimeToLife = (
  isRememberMe: boolean,
  isAccessToken: boolean | undefined,
  config: ConfigService<Env, true>,
): string => {
  if (isAccessToken) {
    return config.get('JWT_ACCESS_EXPIRY', { infer: true });
  }
  return isRememberMe
    ? config.get('JWT_REFRESH_EXPIRY_LONG', { infer: true })
    : config.get('JWT_REFRESH_EXPIRY_SHORT', { infer: true });
};

export const setCookie = (
  res: Response,
  name: CookieKey,
  value: string,
  expiresAt: Date,
  options: CookieOptions | undefined,
  config: ConfigService<Env, true>,
): void => {
  const maxAge = expiresAt.getTime() - Date.now();
  const cookieOptions: CookieOptions = {
    maxAge,
    httpOnly: options?.httpOnly ?? true,
    path: options?.path ?? '/',
    sameSite:
      config.get('NODE_ENV', { infer: true }) === 'development'
        ? (options?.sameSite ?? 'strict')
        : 'none',
    secure:
      config.get('NODE_ENV', { infer: true }) === 'development'
        ? (options?.secure ?? false)
        : true,
  };

  res.cookie(name, value, cookieOptions);
};

export const getCookie = (req: Request, name: CookieKey): string | undefined =>
  (req.cookies as Record<string, string> | undefined)?.[name];

export const clearCookie = (res: Response, name: CookieKey, path = '/') => {
  res.clearCookie(name, { path });
};

export const clearCookies = (res: Response, name: CookieKey[], path = '/') => {
  name.forEach((name) => res.clearCookie(name, { path }));
};

export const clearAllCookies = (res: Response, path = '/') => {
  clearCookies(res, Object.values(COOKIES), path);
};
