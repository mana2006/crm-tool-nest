import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher.port';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { ValidateCredentialsUseCase } from '@/modules/auth/application/use-cases/validate-credentials.use-case';
import { JwtStrategy } from '@/modules/auth/infrastructure/passport/jwt.strategy';
import { LocalStrategy } from '@/modules/auth/infrastructure/passport/local.strategy';
import { A2PasswordHasherService } from '@/modules/auth/infrastructure/security/argon2-password-hasher';
import { JwtTokenService } from '@/modules/auth/infrastructure/token/jwt-token-service';
import { UsersModule } from '@/modules/users/users.module';
import { Argon2Module } from '@/shared/argon2/argon2.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    DrizzleModule,
    Argon2Module,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LocalStrategy,
    JwtStrategy,
    ValidateCredentialsUseCase,
    {
      provide: PasswordHasherPort,
      useClass: A2PasswordHasherService,
    },
    JwtTokenService,
    ConfigService,
  ],
})
export class AuthModule {}
