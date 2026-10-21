import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { JwtTokenService } from '@/modules/auth/infrastructure/token/jwt-token-service';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { AuthResponseUser, RoleIdentity } from '@/shared/types';
import { calculateTimeToLife } from '@/shared/utils/cookie.ulti';
import { Injectable } from '@nestjs/common';
import ms, { type StringValue } from 'ms';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly userSessionReporitory: UserSessionRepositoryPort,
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
    const sessionTtl = calculateTimeToLife(data.rememberMe);

    const sessionExpiry = new Date(Date.now() + ms(sessionTtl as StringValue));
    const accessToken = await this.jwtTokenService.signAccess({
      email: data.user.email,
      roleName: data.user.role.slug,
    });

    this.userSessionReporitory.create({
      userId: data.user.id,
      refreshToken: refreshToken,
      revokeAt: sessionExpiry,
      userAgent: data.userAgent,
      ip: data.ip,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiredsIn: sessionExpiry,
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
