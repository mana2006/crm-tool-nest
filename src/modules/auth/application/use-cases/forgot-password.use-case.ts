import { Env } from '@/config/envs';
import {
  DataCreatePasswordReset,
  PasswordResetRepositoryPort,
} from '@/modules/auth/application/ports/password-reset-repository.port';
import { TokenServicePort } from '@/modules/auth/application/ports/token-service.port';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { resetTokenKey, resetUserKey } from '@/shared/constants/auth.constants';
import { KeyEmailTemplate } from '@/shared/constants/mail.constants';
import { MailService } from '@/shared/mail/mail.service';
import { SendEmailTemplateOptionDto } from '@/shared/mail/presentation/dto/mail.dto';
import { RedisService } from '@/shared/redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly mailService: MailService,
    private readonly jwtTokenService: TokenServicePort,
    private readonly passwordResetRepository: PasswordResetRepositoryPort,
    private readonly config: ConfigService<Env, true>,
    private readonly redis: RedisService,
  ) {}

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByEmail(email, true);

    const resetTokenTtl = ms(
      this.config.get('JWT_ACCESS_EXPIRY', { infer: true }) as StringValue,
    );

    if (!user) {
      throw new BadRequestException(
        'Your email has been suppended or locked, Please try to contact admin for support.',
      );
    }

    const oldToken = await this.redis.get(resetUserKey(user.id));

    if (oldToken) await this.redis.del(resetTokenKey(oldToken));

    const resetTokenString = await this.jwtTokenService.signAccess(
      { email: email },
      resetTokenTtl / 1000,
    );

    const dataCreate: DataCreatePasswordReset = {
      userId: user.id,
      tokenHash: resetTokenString,
      expiresAt: new Date(Date.now() + resetTokenTtl),
    };

    await this.passwordResetRepository.create(dataCreate);

    await this.redis.set(
      resetTokenKey(resetTokenString),
      user.id.toString(),
      resetTokenTtl / 1000,
    );

    await this.redis.set(
      resetUserKey(user.id),
      resetTokenString,
      resetTokenTtl / 1000,
    );

    const resetUrl =
      `${this.config.get('FRONTEND_URL', { infer: true })}/reset-password` +
      `?token=${encodeURIComponent(resetTokenString)}`;

    const data = {
      to: user.email,
      template: KeyEmailTemplate.RESET_PASSWORD,
      context: {
        name: `${user.firstName} ${user.lastName}`,
        resetUrl: resetUrl,
      },
    };

    this.sendPasswordResetEmail(data);

    return {
      success: true,
      message: 'Send email forgot password successfully.',
    };
  }

  private async sendPasswordResetEmail(
    data: SendEmailTemplateOptionDto,
  ): Promise<void> {
    await this.mailService.sendForgotPasswordEmail(data);
  }
}
