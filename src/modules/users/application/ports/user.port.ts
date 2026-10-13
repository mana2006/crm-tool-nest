import { UserEntity } from '@/modules/users/domain/entities/user.entity';

export abstract class UserPort {
  abstract findById(id: number): Promise<UserEntity | null>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
