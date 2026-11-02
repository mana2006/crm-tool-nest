import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async execute(refreshToken: string) {
    const userSession =
      await this.userSessionRepository.findByTokenHash(refreshToken);

    if (!userSession) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
