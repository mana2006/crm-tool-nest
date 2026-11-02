import { Env } from '@/config/envs';
import { JwtPayload } from '@/modules/auth/application/ports/token-service.port';
import { ValidateTokenUseCase } from '@/modules/auth/application/use-cases/validate-token.use-case';
import { COOKIES } from '@/shared/constants/auth.constants';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService<Env, true>,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.[COOKIES.ACCESS_TOKEN] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET', { infer: true }) || '',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.sessionId)
      await this.validateTokenUseCase.execute(payload.sessionId);

    return {
      email: payload.email,
      roleName: payload.roleName,
      sessionId: payload.sessionId,
    };
  }
}
