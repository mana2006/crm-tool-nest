import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { PasswordResetRepositoryPort } from '@/modules/auth/application/ports/password-reset-repository.port';
import { TokenServicePort } from '@/modules/auth/application/ports/token-service.port';
import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { ForgotPasswordUseCase } from '@/modules/auth/application/use-cases/forgot-password.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@/modules/auth/application/use-cases/logout.use-case';
import { ValidateCredentialsUseCase } from '@/modules/auth/application/use-cases/validate-credentials.use-case';
import { ValidateTokenUseCase } from '@/modules/auth/application/use-cases/validate-token.use-case';
import { PasswordResetRepository } from '@/modules/auth/infrastructure/repositories/password-reset.repository';
import { UserSessionRepository } from '@/modules/auth/infrastructure/repositories/user-session.repository';
import { JwtTokenService } from '@/modules/auth/infrastructure/token/jwt-token-service';
import { UsersModule } from '@/modules/users/users.module';
import { JwtStrategy } from '@/shared/guards/passport/jwt.strategy';
import { LocalStrategy } from '@/shared/guards/passport/local.strategy';
import { MailModule } from '@/shared/mail/mail.module';
import { PasswordHasherModule } from '@/shared/security/password-hasher.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';
import { RedisModule } from '@/shared/redis';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    DrizzleModule,
    UsersModule,
    PasswordHasherModule,
    MailModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    RefreshTokenUseCase,
    ResetPasswordUseCase,
    LocalStrategy,
    JwtStrategy,
    ValidateCredentialsUseCase,
    ValidateTokenUseCase,
    JwtTokenService,
    { provide: UserSessionRepositoryPort, useClass: UserSessionRepository },
    { provide: TokenServicePort, useClass: JwtTokenService },
    { provide: PasswordResetRepositoryPort, useClass: PasswordResetRepository },
  ],
})
export class AuthModule {}
