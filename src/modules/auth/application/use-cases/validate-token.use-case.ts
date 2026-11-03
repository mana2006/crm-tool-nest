import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { blackListKey } from '@/shared/constants/auth.constants';
import { RedisService } from '@/shared/redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    private readonly userSessionRepo: UserSessionRepositoryPort,
    private readonly redis: RedisService,
  ) {}

  async execute(sessionId: string) {
    const isExisted = await this.redis.get(blackListKey(sessionId));

    if (isExisted) {
      throw new UnauthorizedException(
        'Session has been terminated. Please log in again.',
      );
    }

    const result = await this.userSessionRepo.findById(sessionId);

    if (!result) {
      throw new UnauthorizedException(
        'Session has been terminated. Please log in again.',
      );
    }
  }
}
