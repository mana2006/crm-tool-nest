import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { ValidateCredentialsUseCase } from '@/modules/auth/application/use-cases/validate-credentials.use-case';
import { JwtTokenService } from '@/modules/auth/infrastructure/token/jwt-token-service';
import { UsersModule } from '@/modules/users/users.module';
import { JwtStrategy } from '@/shared/guards/passport/jwt.strategy';
import { LocalStrategy } from '@/shared/guards/passport/local.strategy';
import { PasswordHasherModule } from '@/shared/security/password-hasher.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';
import { UserSessionRepositoryPort } from '@/modules/auth/application/ports/user-session-repository.port';
import { UserSessionRepository } from '@/modules/auth/infrastructure/repositories/user-session.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    DrizzleModule,
    UsersModule,
    PasswordHasherModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LocalStrategy,
    JwtStrategy,
    ValidateCredentialsUseCase,
    JwtTokenService,
    ConfigService,
    { provide: UserSessionRepositoryPort, useClass: UserSessionRepository },
  ],
})
export class AuthModule {}
