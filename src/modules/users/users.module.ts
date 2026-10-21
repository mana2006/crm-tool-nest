import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { CreateUseCase } from '@/modules/users/application/use-cases/create.use-case';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { PasswordHasherModule } from '@/shared/security/password-hasher.module';
import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [DrizzleModule, PasswordHasherModule],
  controllers: [UserController],
  providers: [
    CreateUseCase,
    { provide: UserRepositoryPort, useClass: UserRepository },
  ],
  exports: [UserRepositoryPort],
})
export class UsersModule {}
