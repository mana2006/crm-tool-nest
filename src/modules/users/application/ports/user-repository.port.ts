import { UserInsert } from '@/database/drizzle/schema';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

export abstract class UserRepositoryPort {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract findByEmail(
    email: string,
    isActive?: boolean,
  ): Promise<UserEntity | null>;
  abstract create(data: UserInsert): Promise<Partial<UserInsert> | null>;
  abstract update(data: Partial<UserInsert>, userId: number): Promise<void>;
}
