import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard } from '../../../src/common/auth/jwt-auth.guard';

function createExecutionContext(headers: Record<string, string>) {
  const request = { headers } as { headers: Record<string, string>; user?: unknown };
  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
  return { request, context };
}

describe('JwtAuthGuard (transactions)', () => {
  const originalEnv = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  it('authorizes request with valid bearer token', async () => {
    process.env.JWT_SECRET = 'secret';
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-id' }),
    };
    const guard = new JwtAuthGuard(jwtService as unknown as JwtService);
    const { context, request } = createExecutionContext({
      authorization: 'Bearer valid-token',
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'secret',
    });
    expect(request.user).toEqual({ sub: 'user-id' });
  });

  it('throws when bearer token is missing', async () => {
    process.env.JWT_SECRET = 'secret';
    const jwtService = {
      verifyAsync: jest.fn(),
    };
    const guard = new JwtAuthGuard(jwtService as unknown as JwtService);
    const { context } = createExecutionContext({});

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});

