import {
  AccessPayload,
  RefreshPayload,
  TokenServicePort,
} from '@/modules/auth/application/ports/token-service.port';
import { calculateTimeToLife } from '@/shared/utils/cookie.ulti';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';

type SecrectKey = 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET';

@Injectable()
export class JwtTokenService extends TokenServicePort {
  private readonly logger = new Logger(JwtTokenService.name);
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async signAccess(payload: Record<string, unknown>): Promise<string> {
    return await this.jwt.signAsync(
      { email: payload.email, roleId: payload.roleName },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRY'),
      },
    );
  }

  async signRefresh(
    payload: Record<string, unknown>,
    rememberMe: boolean,
  ): Promise<string> {
    // const expiredsIn = !rememberMe
    //   ? this.config.get('JWT_REFRESH_EXPIRY_SHORT')
    //   : this.config.get('JWT_REFRESH_EXPIRY_LONG');

    const expiredsIn = calculateTimeToLife(
      rememberMe,
    ) as JwtSignOptions['expiresIn'];

    return await this.jwt.signAsync(
      { email: payload.email },
      { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: expiredsIn },
    );
  }

  async verifyAccess(token: string): Promise<AccessPayload> {
    return await this.verifyToken<AccessPayload>(token, 'JWT_ACCESS_SECRET');
  }

  async verifyRefresh(token: string): Promise<RefreshPayload> {
    return await this.verifyToken<RefreshPayload>(token, 'JWT_REFRESH_SECRET');
  }

  private async verifyToken<T extends object>(
    token: string,
    secretKey: SecrectKey,
  ): Promise<T> {
    try {
      return await this.jwt.verifyAsync<T>(token, {
        secret: this.config.get<string>(secretKey, { infer: true }),
      });
    } catch (error) {
      this.logger.warn(
        `Token verification failed: ${(error as Error).message}`,
      );
      throw new TokenExpiredError(
        `Token verification failed: ${(error as Error).message}`,
        new Date(),
      );
    }
  }
}
