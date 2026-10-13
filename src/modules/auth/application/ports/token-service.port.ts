export interface AccessPayload {
  sub: string;
  role: string;
}
export interface RefreshPayload {
  sub: string;
}

export abstract class TokenServicePort {
  abstract signAccess(payload: Record<string, unknown>): Promise<string>;
  abstract signRefresh(
    payload: Record<string, unknown>,
    rememberMe: boolean,
  ): Promise<string>;
  abstract verifyAccess(token: string): Promise<AccessPayload>;
  abstract verifyRefresh(token: string): Promise<RefreshPayload>;
}
