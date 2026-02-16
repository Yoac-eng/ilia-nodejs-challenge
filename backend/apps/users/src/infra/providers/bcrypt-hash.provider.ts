import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import type { IHashProvider } from '../../domain/interfaces/providers/hash.provider.interface';

@Injectable()
export class BcryptHashProvider implements IHashProvider {
  async hash(plainText: string): Promise<string> {
    return await hash(plainText, 10);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return await compare(plainText, hashed);
  }
}
