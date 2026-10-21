import { RoleEntity } from '@/modules/roles/domain/entities/role.entity';

export abstract class RoleRepositoryPort {
  abstract findBySlug(name: string): Promise<RoleEntity | null>;
}
