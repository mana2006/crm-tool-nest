import {
  DrizzleAsyncProvider,
  type DrizzleDB,
} from '@/database/drizzle/drizzle.provider';
import { users } from '@/database/drizzle/schema/users.schema';
import { UserPort } from '@/modules/users/application/ports/user.port';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { eq, SQL } from 'drizzle-orm';

@Injectable()
export class UserRepository extends UserPort {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: DrizzleDB,
  ) {
    super();
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.findOne(eq(users.id, id));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne(eq(users.email, email));
  }

  private async findOne(where: SQL) {
    const [user] = await this.db.select().from(users).where(where).limit(1);
    return this.toEntity(user);
  }

  private toEntity(row: typeof users.$inferSelect) {
    return row ? Object.assign(new UserEntity(), row) : null;
  }
}
