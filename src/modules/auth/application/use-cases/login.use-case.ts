import { Env } from '@/config/envs';
import { TokenServicePort } from '@/modules/auth/application/ports/token-service.port';
import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { RedisService } from '@/shared/redis';
import { AuthResponseUser, RoleIdentity } from '@/shared/types';
import { calculateTimeToLife } from '@/shared/utils/cookie.ulti';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { type StringValue } from 'ms';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);
  constructor(
    private readonly jwtTokenService: TokenServicePort,
    private readonly userSessionReporitory: UserSessionRepositoryPort,
    private readonly config: ConfigService<Env, true>,
    // private readonly redis: RedisService,
  ) {}

  async execute(data: {
    user: UserEntity;
    rememberMe: boolean;
    ip: string;
    userAgent: string;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    expiredsIn: Date;
    mfaRequired?: boolean;
    user: AuthResponseUser & { role: RoleIdentity };
  }> {
    const refreshToken = await this.jwtTokenService.signRefresh(
      { email: data.user.email, roleName: data.user.role.slug },
      data.rememberMe,
    );
    const timeToLife = ms(
      calculateTimeToLife(data.rememberMe, false, this.config) as StringValue,
    );

    const expiredRefreshToken = new Date(Date.now() + timeToLife);

    const sessionId = await this.userSessionReporitory.create({
      userId: data.user.id,
      refreshToken: refreshToken,
      expiredAt: expiredRefreshToken,
      userAgent: data.userAgent,
      ip: data.ip,
    });

    const sessionData = {
      email: data.user.email,
      roleName: data.user.role.slug,
      sessionId: sessionId.insertId.toString(),
    };

    const accessToken = await this.jwtTokenService.signAccess(sessionData);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiredsIn: expiredRefreshToken,
      user: {
        id: data.user.id.toString(),
        email: data.user.email,
        displayName: `${data.user.firstName} ${data.user.lastName}`,
        status: data.user.status,
        role: data.user.role,
        mfaRequired: !!data.user.mfaEnabled,
      },
    };
  }
}
