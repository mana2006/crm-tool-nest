import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { UserPort } from '@/modules/users/application/ports/user.port';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [{ provide: UserPort, useClass: UserRepository }],
  exports: [UserPort],
})
export class UsersModule {}
