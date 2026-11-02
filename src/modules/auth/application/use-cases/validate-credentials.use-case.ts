import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ValidateCredentialsUseCase {
  private readonly logger = new Logger(ValidateCredentialsUseCase.name);
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

    let isPasswordValid: boolean;
    try {
      isPasswordValid = await this.passwordHasher.compare(
        user.password,
        data.password,
      );
    } catch (error) {
      this.logger.error('Error occurred while validating credentials', error);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('Your account is not activated!');
    }

    return user;
  }
}
