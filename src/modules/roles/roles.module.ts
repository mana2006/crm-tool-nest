import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { RoleRepositoryPort } from '@/modules/roles/application/ports/role-repository.port';
import { RoleRepository } from '@/modules/roles/infrastructure/repositories/role.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [DrizzleModule],
  controllers: [],
  providers: [{ provide: RoleRepositoryPort, useClass: RoleRepository }],
  // exports: [RoleRepositoryPort]
})
export class RolesModule {}
