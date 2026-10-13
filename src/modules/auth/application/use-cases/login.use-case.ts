import { JwtTokenService } from '@/modules/auth/infrastructure/token/jwt-token-service';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { type StringValue } from 'ms';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly config: ConfigService,
  ) {}

  async execute(data: { user: UserEntity; rememberMe: boolean }): Promise<{
    accessToken?: string;
    refreshToken?: string;
    expiredsIn?: Date;
    mfaRequired?: boolean;
    user: Partial<UserEntity>;
  }> {
    const refreshToken = await this.jwtTokenService.signRefresh(
      { email: data.user.email },
      data.rememberMe,
    );
    const sessionTtl = data.rememberMe
      ? this.config.get('JWT_REFRESH_EXPIRY_LONG', { infer: true })
      : this.config.get('JWT_REFRESH_EXPIRY_SHORT', { infer: true });
    const sessionExpiry = new Date(Date.now() + ms(sessionTtl as StringValue));
    const accessToken = await this.jwtTokenService.signAccess({
      email: data.user.email,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiredsIn: sessionExpiry,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      },
    };
  }
}
