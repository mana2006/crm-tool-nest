import { Argon2PasswordHasher } from '@/shared/security/argon2/argon2-password-hasher-';
import { Argon2Service } from '@/shared/security/argon2/argon2.service';
import { PasswordHasherPort } from '@/shared/security/password-hasher.port';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    Argon2Service,
    { provide: PasswordHasherPort, useClass: Argon2PasswordHasher },
  ],
  exports: [PasswordHasherPort],
})
export class PasswordHasherModule {}
