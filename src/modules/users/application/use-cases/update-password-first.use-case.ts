import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UpdatePasswordFirstUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User invalid!');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('User is not activated!');
    }

    const newPassword = await this.passwordHasher.hash(password);

    await this.userRepository.update(
      { password: newPassword.toString() },
      user.id,
    );

    return {
      success: true,
      message: 'Updated password successfully!',
    };
  }
}
