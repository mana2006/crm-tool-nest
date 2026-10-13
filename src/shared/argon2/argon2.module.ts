import { Argon2Service } from '@/shared/argon2/argon2.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [Argon2Service],
  exports: [Argon2Service],
})
export class Argon2Module {}
