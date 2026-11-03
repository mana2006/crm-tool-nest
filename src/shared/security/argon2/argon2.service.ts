import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async compare(hashedPassword: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch (error) {
      return false;
    }
  }
}
