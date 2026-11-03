import { Gender, UserStatus } from '@/shared/constants/user.constants';

export interface CreateUserResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  password: string;
  role_id: string;
  status: UserStatus;
}
