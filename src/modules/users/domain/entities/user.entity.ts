import type {
  Gender as GenderType,
  UserStatus as UserStatusType,
} from '@shared/constants/user.constants';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: GenderType;
  email: string;
  backupEmail: string | null;
  backupEmailVerifiedAt: Date | null;
  password: string;
  roleId: number;
  status: UserStatusType;
  emailVerifiedAt: Date | null;
  phone: string | null;
  mfaEnabled: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
