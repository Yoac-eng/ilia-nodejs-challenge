import {
  UnauthorizedException,
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { user?: unknown };

export const AuthenticatedUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = request.user;

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('sub' in payload) ||
      typeof payload.sub !== 'string'
    ) {
      throw new UnauthorizedException('Invalid bearer token payload');
    }

    return payload.sub;
  },
);
