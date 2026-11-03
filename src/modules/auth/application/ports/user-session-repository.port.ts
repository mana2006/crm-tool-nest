import { UserSessionEntity } from '@/modules/auth/domain/entities/user-session.entity';
import { Injectable } from '@nestjs/common';

export type DataUserSession = {
  userId: number;
  refreshToken: string;
  expiredAt: Date;
  revokeReason?: string;
  userAgent: string;
  ip: string;
};

@Injectable()
export abstract class UserSessionRepositoryPort {
  abstract create(data: DataUserSession): Promise<{ insertId: number }>;
  abstract update(data: Partial<DataUserSession>, id: number): Promise<void>;
  abstract findByTokenHash(token: string): Promise<UserSessionEntity | null>;
  abstract findById(id: string): Promise<UserSessionEntity | null>;
  abstract revokeByTokenHash(token: string): Promise<void>;
  abstract revokeAllTokenByUserId(userId: number): Promise<UserSessionEntity[]>;
}
