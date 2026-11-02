import { Env } from '@/config/envs';
import { TokenServicePort } from '@/modules/auth/application/ports/token-service.port';
import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { calculateTimeToLife } from '@/shared/utils/cookie.ulti';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userSessionRepository: UserSessionRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtTokenService: TokenServicePort,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async execute(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiredRefreshToken: Date;
    expiredAccessToken: Date;
  }> {
    const userSession =
      await this.userSessionRepository.findByTokenHash(refreshToken);

    if (!userSession) {
      throw new UnauthorizedException('User Invalid');
    }

    const user = await this.userRepository.findById(userSession.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('User invalid');
    }

    const newRefreshToken = await this.jwtTokenService.signRefresh(
      { email: user.email, roleName: user.role.slug },
      false,
    );

    const sessionData = {
      email: user.email,
      roleName: user.role.slug,
      sessionId: userSession.id.toString(),
    };

    const newAccessToken = await this.jwtTokenService.signAccess(sessionData);
    const timeToLifeAccessToken = ms(
      calculateTimeToLife(false, true, this.config) as StringValue,
    );
    const timeToLifeRefreshToken = ms(
      calculateTimeToLife(false, false, this.config) as StringValue,
    );

    const expiredAccessToken = new Date(Date.now() + timeToLifeAccessToken);
    const expiredRefreshToken = new Date(Date.now() + timeToLifeRefreshToken);

    await this.userSessionRepository.update(
      { refreshToken: newRefreshToken, expiredAt: expiredRefreshToken },
      userSession.id,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiredRefreshToken: expiredRefreshToken,
      expiredAccessToken: expiredAccessToken,
    };
  }
}
