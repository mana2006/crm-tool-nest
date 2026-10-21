export class UserSessionEntity {
  id: number;
  userId: number;
  refreshToken: string;
  revokeAt?: Date;
  revokeReason?: string;
  userAgent: string;
  ip: string;
}
