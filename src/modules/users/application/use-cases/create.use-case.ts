import { UserInsert } from '@/database/drizzle/schema';
import { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';
import { CreateUserRequestDto } from '@/modules/users/presentation/dto/create-user-request.dto';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(data: CreateUserRequestDto) {
    const emailExist = await this.userRepository.findByEmail(data.email);

    if (emailExist) {
      throw new ConflictException('Email is already registered!');
    }

    const passwordHasher = await this.passwordHasher.hash(data.password);

    const newUser: UserInsert = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: passwordHasher.toString(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      roleId: Number(data.roleId),
      status: data.status,
      mfaEnabled: data.mfaEnabled,
    };

    return this.userRepository.create(newUser);
  }
}
