import { PasswordResetTokenEntity } from '@/modules/auth/domain/entities/password-reset-token.entity';

export interface DataCreatePasswordReset {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export abstract class PasswordResetRepositoryPort {
  abstract findByUserId(
    userId: number,
  ): Promise<PasswordResetTokenEntity | null>;
  abstract findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordResetTokenEntity | null>;
  abstract create(data: DataCreatePasswordReset): Promise<string>;
  abstract markAsUse(userId: number): Promise<void>;
}
