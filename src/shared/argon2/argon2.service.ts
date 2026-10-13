import * as argon2 from 'argon2';

export class Argon2Service {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async compare(hashedPassword: string, password: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }
}
