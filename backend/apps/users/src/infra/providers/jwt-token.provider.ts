import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { ITokenProvider } from '../../domain/interfaces/providers/token.provider.interface';

@Injectable()
export class JwtTokenProvider implements ITokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: Record<string, unknown>): string {
    return this.jwtService.sign(payload);
  }
}
