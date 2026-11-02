export interface JwtPayload {
  email: string;
  roleName?: string;
  sessionId?: string;
}

export interface AccessPayload {
  sub: string;
  role: string;
}
export interface RefreshPayload {
  sub: string;
}

export abstract class TokenServicePort {
  abstract signAccess(payload: JwtPayload, ttl?: number): Promise<string>;
  abstract signRefresh(
    payload: Record<string, unknown>,
    rememberMe: boolean,
    ttl?: Date,
  ): Promise<string>;
  abstract verifyAccess(token: string): Promise<AccessPayload>;
  abstract verifyRefresh(token: string): Promise<RefreshPayload>;
}
