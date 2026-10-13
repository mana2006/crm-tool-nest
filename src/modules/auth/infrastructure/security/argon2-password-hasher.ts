// import { PasswordHasher } from "@/modules/auth/application/repositories/password-hasher.repository";
import { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher.port';
import { Argon2Service } from '@/shared/argon2/argon2.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class A2PasswordHasherService extends PasswordHasherPort {
  constructor(private readonly argon2: Argon2Service) {
    super();
  }

  async hash(password: string): Promise<string> {
    return await this.argon2.hash(password);
  }

  async compare(hashedPassword: string, password: string): Promise<boolean> {
    return await this.argon2.compare(hashedPassword, password);
  }
}
