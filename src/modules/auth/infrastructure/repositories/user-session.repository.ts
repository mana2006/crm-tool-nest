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
import { RESET_REASON } from '@/shared/constants/auth.constants';
import { Inject } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';

export class UserSessionRepository extends UserSessionRepositoryPort {
  constructor(@Inject(DrizzleAsyncProvider) private readonly db: DrizzleDB) {
    super();
  }

  async create(data: DataUserSession): Promise<{ insertId: number }> {
    const [result] = await this.db
      .insert(userSession)
      .values(data)
      .returning({ insertId: userSession.id });
    return result;
  }

  async update(data: Partial<DataUserSession>, id: number): Promise<void> {
    await this.db.update(userSession).set(data).where(eq(userSession.id, id));
  }

  async findByTokenHash(token: string): Promise<UserSessionEntity | null> {
    const [result] = await this.db
      .select()
      .from(userSession)
      .where(
        and(
          eq(userSession.refreshToken, token),
          isNull(userSession.revokeAt),
          gt(userSession.expiredAt, new Date()),
        ),
      );

    if (result) return this.toEntity(result);

    return null;
  }

  async findById(id: string): Promise<UserSessionEntity | null> {
    const result = await this.db.query.userSession.findFirst({
      where: (userSession) =>
        and(
          eq(userSession.id, parseInt(id)),
          isNull(userSession.revokeAt),
          gt(userSession.expiredAt, new Date()),
        ),
    });

    return result ?? null;
  }

  async revokeByTokenHash(token: string): Promise<void> {
    await this.db
      .update(userSession)
      .set({ revokeAt: new Date() })
      .where(eq(userSession.refreshToken, token));
  }

  async revokeAllTokenByUserId(userId: number): Promise<UserSessionEntity[]> {
    const result = await this.db
      .update(userSession)
      .set({ revokeAt: new Date(), revokeReason: RESET_REASON.RESET_PASSWORD })
      .where(eq(userSession.userId, userId))
      .returning();

    return result;
  }

  private toEntity(row: UserSessionSelect): UserSessionEntity | null {
    const { ...rowFields } = row;
    return Object.assign(new UserSessionEntity(), rowFields);
  }
}
