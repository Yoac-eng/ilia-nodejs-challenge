import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AUTH_MODE_KEY, type AuthMode } from './auth-mode.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

interface HttpHeaders {
  readonly [key: string]: string | string[] | undefined;
}

interface AuthenticatedRequest {
  headers: HttpHeaders;
  user?: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const authMode =
      this.reflector.getAllAndOverride<AuthMode>(AUTH_MODE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'external';

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.getBearerToken(request.headers);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = await this.verifyTokenByMode(token, authMode);
    request.user = payload;
    return true;
  }

  private async verifyTokenByMode(
    token: string,
    authMode: AuthMode,
  ): Promise<unknown> {
    if (authMode === 'internal') {
      return this.verifyWithSecret(token, process.env.INTERNAL_JWT_SECRET);
    }

    if (authMode === 'either') {
      try {
        return await this.verifyWithSecret(token, process.env.JWT_SECRET);
      } catch {
        return this.verifyWithSecret(token, process.env.INTERNAL_JWT_SECRET);
      }
    }

    return this.verifyWithSecret(token, process.env.JWT_SECRET);
  }

  private async verifyWithSecret(
    token: string,
    secret: string | undefined,
  ): Promise<unknown> {
    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid bearer token');
    }
  }

  private getBearerToken(headers: HttpHeaders): string | undefined {
    const authorization = this.getHeaderValue(headers, 'authorization');
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return token;
  }

  private getHeaderValue(
    headers: HttpHeaders,
    headerName: string,
  ): string | undefined {
    const value = headers[headerName];
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return value[0];
    }

    const lowercaseValue = headers[headerName.toLowerCase()];
    if (typeof lowercaseValue === 'string') {
      return lowercaseValue;
    }
    if (Array.isArray(lowercaseValue)) {
      return lowercaseValue[0];
    }
    return undefined;
  }
}
