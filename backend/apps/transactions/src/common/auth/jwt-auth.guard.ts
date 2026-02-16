import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface HttpHeaders {
  readonly [key: string]: string | string[] | undefined;
}

interface AuthenticatedRequest {
  headers: HttpHeaders;
  user?: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.getBearerToken(request.headers);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
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
