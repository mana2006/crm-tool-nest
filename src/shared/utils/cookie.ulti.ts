import { envs } from '@/config/envs';
import { COOKIES } from '@/shared/constants/auth.constants';
import { CookieKey } from '@/shared/types';
import { CookieOptions, Request, Response } from 'express';

type CookieSetOption = {
  name: CookieKey;
  value: string;
  expiredAt: Date;
  options?: CookieOptions;
};

export const calculateTimeToLife = (isRememberMe: boolean): string => {
  return isRememberMe
    ? envs.JWT_REFRESH_EXPIRY_LONG
    : envs.JWT_REFRESH_EXPIRY_SHORT;
};

export const setCookie = (
  res: Response,
  name: CookieKey,
  value: string,
  expiresAt: Date,
  options?: CookieOptions,
): void => {
  const maxAge = expiresAt.getTime() - Date.now();
  const cookieOptions: CookieOptions = {
    maxAge,
    httpOnly: options?.httpOnly ?? true,
    path: options?.path ?? '/',
    sameSite:
      envs.NODE_ENV === 'development'
        ? (options?.sameSite ?? 'strict')
        : 'none',
    secure: envs.NODE_ENV === 'development' ? (options?.secure ?? false) : true,
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
