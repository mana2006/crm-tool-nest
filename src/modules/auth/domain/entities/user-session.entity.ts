export class UserSessionEntity {
  id: number;
  userId: number;
  refreshToken: string;
  revokeAt: Date | null;
  expiredAt: Date | null;
  revokeReason: string | null;
  userAgent: string | null;
  ip: string | null;
}
