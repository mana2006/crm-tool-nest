import { ValidateCredentialsUseCase } from '@/modules/auth/application/use-cases/validate-credentials.use-case';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateCredentials: ValidateCredentialsUseCase,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.validateCredentials.execute({ email, password });
    return user;
  }
}
