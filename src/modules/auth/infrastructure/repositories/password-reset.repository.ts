import {
  DrizzleAsyncProvider,
  type DrizzleDB,
} from '@/database/drizzle/drizzle.provider';
import { passwordResetTokens } from '@/database/drizzle/schema';
import {
  DataCreatePasswordReset,
  PasswordResetRepositoryPort,
} from '@/modules/auth/application/ports/password-reset-repository.port';
import { PasswordResetTokenEntity } from '@/modules/auth/domain/entities/password-reset-token.entity';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';

@Injectable()
export class PasswordResetRepository extends PasswordResetRepositoryPort {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: DrizzleDB) {
    super();
  }

  async findByUserId(userId: number): Promise<PasswordResetTokenEntity | null> {
    const result = await this.db.query.passwordResetTokens.findFirst({
      where: (passwordResetTokens) =>
        and(
          eq(passwordResetTokens.userId, userId),
          isNull(passwordResetTokens.usesAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
    });

    if (!result) return null;

    return result;
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordResetTokenEntity | null> {
    const result = await this.db.query.passwordResetTokens.findFirst({
      where: (passwordResetTokens) =>
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usesAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
    });

    if (!result) return null;

    return result;
  }

  async create(data: DataCreatePasswordReset): Promise<string> {
    const [result] = await this.db
      .insert(passwordResetTokens)
      .values(data)
      .returning({ tokenHash: passwordResetTokens.tokenHash });
    return result.tokenHash;
  }

  async markAsUse(userId: number): Promise<void> {
    await this.db
      .update(passwordResetTokens)
      .set({ usesAt: new Date() })
      .where(eq(passwordResetTokens.userId, userId));
  }
}
