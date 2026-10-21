import {
  DrizzleAsyncProvider,
  type DrizzleDB,
} from '@/database/drizzle/drizzle.provider';
import { userSession, UserSessionSelect } from '@/database/drizzle/schema';
import {
  DataUserSession,
  UserSessionRepositoryPort,
} from '@/modules/auth/application/ports/user-session-repository.port';
import { UserSessionEntity } from '@/modules/auth/domain/entities/user-session.entity';
import { Inject } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';

export class UserSessionRepository extends UserSessionRepositoryPort {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: DrizzleDB) {
    super();
  }

  async create(data: DataUserSession): Promise<void> {
    await this.db.insert(userSession).values(data).returning();
  }

  async findByTokenHash(token: string): Promise<UserSessionEntity | null> {
    const [result] = await this.db
      .select()
      .from(userSession)
      .where(
        and(
          eq(userSession.refreshToken, token),
          isNotNull(userSession.revokeAt),
        ),
      );
    return this.toEntity(result);
  }

  async revokeByTokenHash(token: string): Promise<void> {
    await this.db
      .update(userSession)
      .set({ revokeAt: null })
      .where(eq(userSession.refreshToken, token));
  }

  async revokeAllTokenByUserId(userId: string): Promise<void> {
    await this.db
      .update(userSession)
      .set({ revokeAt: null })
      .where(eq(userSession.userId, parseInt(userId)));
  }

  private toEntity(row: UserSessionSelect): UserSessionEntity {
    const { ...rowFields } = row;
    return Object.assign(new UserSessionEntity(), rowFields);
  }
}
