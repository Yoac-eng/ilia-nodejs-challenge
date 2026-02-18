import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { Reflector } from '@nestjs/core';

import { JwtAuthGuard } from '../../../src/common/auth/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../../../src/common/auth/public.decorator';

function createExecutionContext(headers: Record<string, string>) {
  const request = { headers } as { headers: Record<string, string>; user?: unknown };
  const context = {
    getHandler: () => jest.fn(),
    getClass: () => class TestClass {},
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
  return { request, context };
}

describe('JwtAuthGuard (users)', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it('allows public routes without token', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockImplementation((key: string) => {
        if (key === IS_PUBLIC_KEY) return true;
        return undefined;
      }),
    };
    const jwtService = {
      verifyAsync: jest.fn(),
    };
    const guard = new JwtAuthGuard(
      reflector as unknown as Reflector,
      jwtService as unknown as JwtService,
    );
    const { context } = createExecutionContext({});

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('throws when token is missing on protected route', async () => {
    process.env.JWT_SECRET = 'secret';
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    };
    const jwtService = {
      verifyAsync: jest.fn(),
    };
    const guard = new JwtAuthGuard(
      reflector as unknown as Reflector,
      jwtService as unknown as JwtService,
    );
    const { context } = createExecutionContext({});

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});

