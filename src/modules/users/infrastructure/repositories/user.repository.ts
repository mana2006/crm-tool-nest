import {
  DrizzleAsyncProvider,
  type DrizzleDB,
} from '@/database/drizzle/drizzle.provider';
import { roles } from '@/database/drizzle/schema';
import { UserInsert, users } from '@/database/drizzle/schema/users.schema';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

type UserRowWithRole = typeof users.$inferSelect & {
  role: typeof roles.$inferSelect;
};

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: DrizzleDB,
  ) {
    super();
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.findOne({
      where: eq(users.id, id),
      with: { role: true },
    });

    return user ? this.toEntity(user as UserRowWithRole) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.findOne({
      where: eq(users.email, email),
      with: { role: true },
    });

    return user ? this.toEntity(user as UserRowWithRole) : null;
  }

  async create(data: UserInsert): Promise<Partial<UserInsert> | null> {
    const [inserted] = await this.db.insert(users).values(data).returning();

    return inserted;
  }

  private async findOne(
    condition: Parameters<DrizzleDB['query']['users']['findFirst']>[0],
  ) {
    return (await this.db.query.users.findFirst(condition)) || null;
  }

  private toEntity(row: UserRowWithRole): UserEntity {
    const { role, ...userFields } = row;

    return Object.assign(new UserEntity(), {
      ...userFields,
      role: this.toRoleEntity(role),
    });
  }

  private toRoleEntity(row: typeof roles.$inferSelect) {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
    };
  }
}
