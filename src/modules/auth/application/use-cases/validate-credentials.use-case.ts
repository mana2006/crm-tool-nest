import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ValidateCredentialsUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<UserEntity | null> {
    const user = await this.users.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      user.password,
      data.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
