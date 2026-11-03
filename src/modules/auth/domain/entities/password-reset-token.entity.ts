export class PasswordResetTokenEntity {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usesAt?: Date | null;
}
