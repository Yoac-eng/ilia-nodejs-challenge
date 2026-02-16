import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';

interface UserExistsResponse {
  exists: boolean;
}

@Injectable()
export class HttpUserProvider implements IUserProvider {
  constructor(private readonly jwtService: JwtService) {}

  async verifyUserExists(userId: string): Promise<boolean> {
    const isDevelopmentEnvironment = process.env.NODE_ENV === 'develop';
    const usersServiceUrl = isDevelopmentEnvironment
      ? 'http://localhost:3002'
      : process.env.USERS_SERVICE_URL;

    const serviceToken = await this.createInternalServiceToken();

    const response = await fetch(`${usersServiceUrl}/users/${userId}/exists`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
      },
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error(
        `Users service returned status ${response.status} while validating user.`,
      );
    }

    const data = (await response.json()) as UserExistsResponse;
    return Boolean(data.exists);
  }

  private async createInternalServiceToken(): Promise<string> {
    const secret = process.env.INTERNAL_JWT_SECRET;
    if (!secret) {
      throw new Error('INTERNAL_JWT_SECRET is not configured.');
    }

    return this.jwtService.signAsync(
      {
        sub: 'transactions-service',
        service: 'transactions',
      },
      {
        secret,
        expiresIn: '5m',
      },
    );
  }
}
