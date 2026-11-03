import { UserInsert } from '@/database/drizzle/schema';
import { PasswordResetRepositoryPort } from '@/modules/auth/application/ports/password-reset-repository.port';
import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import {
  BLACKLIST_TTL_SECONDS,
  blackListKey,
  resetUserKey,
} from '@/shared/constants/auth.constants';
import { RedisService } from '@/shared/redis';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly userSessionRepository: UserSessionRepositoryPort,
    private readonly redis: RedisService,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(
    newPassword: string,
    tokenHash: string,
  ): Promise<{ message: string; success: boolean }> {
    let userId = Number(await this.redis.getDel(tokenHash));

    if (!userId) {
      const passwordResetResult =
        await this.passwordResetRepository.findByTokenHash(tokenHash);
      if (!passwordResetResult) {
        throw new UnauthorizedException('Token invalid or expired!');
      }
      userId = passwordResetResult.userId;
    }

    await this.passwordResetRepository.markAsUse(userId);

    const dataUpdateUser: Partial<UserInsert> = {
      password: await this.passwordHasher.hash(newPassword),
    };

    await this.userRepository.update(dataUpdateUser, userId);
    const userSessions =
      await this.userSessionRepository.revokeAllTokenByUserId(userId);

    await Promise.all(
      userSessions.map((session) =>
        this.redis.set(
          blackListKey(session.id.toString()),
          session.id.toString(),
          BLACKLIST_TTL_SECONDS,
        ),
      ),
    );

    await this.redis.del(resetUserKey(userId));

    return {
      message: 'password update successfully.',
      success: true,
    };
  }
}
