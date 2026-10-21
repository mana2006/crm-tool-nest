import { RoleEntity } from '@/modules/roles/domain/entities/role.entity';
import { COOKIES } from '@/shared/constants/auth.constants';
import { UserIdentity } from '@/shared/types/user-base.types';

export type AuthResponseUser = Pick<UserIdentity, 'id' | 'email'> & {
  displayName: string;
  status: string;
  mfaRequired?: boolean;
  role: RoleEntity;
};

export type UserSession = {
  userId: number;
  refreshToken: string;
  revokeAt: Date;
  revokeReason?: string;
};

export type CookieKey = (typeof COOKIES)[keyof typeof COOKIES];
