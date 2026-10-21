import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutUseCase {
  constructor(
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async execute(refreshToken: string) {
    const userSession =
      this.userSessionRepository.findByTokenHash(refreshToken);
    if (!userSession) {
      throw new UnauthorizedException('Invalid session');
    }

    // if (userSession)
  }
}
