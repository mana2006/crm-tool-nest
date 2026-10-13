import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserPort } from '@/modules/users/application/ports/user.port';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { DrizzleModule } from '@/database/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [{ provide: UserPort, useClass: UserRepository }],
  exports: [UserPort],
})
export class UsersModule {}
