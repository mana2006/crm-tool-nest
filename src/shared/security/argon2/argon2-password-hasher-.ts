import { Argon2Service } from '@/shared/security/argon2/argon2.service';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Argon2PasswordHasher extends PasswordHasherPort {
  constructor(private readonly argon2Service: Argon2Service) {
    super();
  }

  async hash(password: string): Promise<string> {
    return await this.argon2Service.hash(password);
  }

  async compare(hashedPassword: string, password: string): Promise<boolean> {
    return await this.argon2Service.compare(hashedPassword, password);
  }
}
