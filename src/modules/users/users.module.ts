import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { CreateUseCase } from '@/modules/users/application/use-cases/create.use-case';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { MailModule } from '@/shared/mail/mail.module';
import { PasswordHasherModule } from '@/shared/security/password-hasher.module';
import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UpdatePasswordFirstUseCase } from '@/modules/users/application/use-cases/update-password-first.use-case';

@Module({
  imports: [DrizzleModule, PasswordHasherModule, MailModule],
  controllers: [UserController],
  providers: [
    CreateUseCase,
    UpdatePasswordFirstUseCase,
    { provide: UserRepositoryPort, useClass: UserRepository },
  ],
  exports: [UserRepositoryPort],
})
export class UsersModule {}
