import {
  DrizzleAsyncProvider,
  type DrizzleDB,
} from '@/database/drizzle/drizzle.provider';
import { roles } from '@/database/drizzle/schema';
import { RoleRepositoryPort } from '@/modules/roles/application/ports/role-repository.port';
import { RoleEntity } from '@/modules/roles/domain/entities/role.entity';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoleRepository extends RoleRepositoryPort {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: DrizzleDB) {
    super();
  }

  async findBySlug(slug: string): Promise<RoleEntity | null> {
    const role = await this.db.query.roles.findFirst({
      where: (roles) => eq(roles.slug, slug),
    });
    return role ? this.toEntity(role) : null;
  }

  private toEntity(row: typeof roles.$inferSelect) {
    return Object.assign(new RoleEntity(), { ...roles, id: String(roles.id) });
  }
}
