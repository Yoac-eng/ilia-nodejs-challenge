import type { JwtService } from '@nestjs/jwt';

import { HttpUserProvider } from '../../../src/infra/providers/http-user.provider';

describe('HttpUserProvider', () => {
  const originalFetch = global.fetch;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalUsersServiceUrl = process.env.USERS_SERVICE_URL;
  const originalInternalSecret = process.env.INTERNAL_JWT_SECRET;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.NODE_ENV = originalNodeEnv;
    process.env.USERS_SERVICE_URL = originalUsersServiceUrl;
    process.env.INTERNAL_JWT_SECRET = originalInternalSecret;
  });

  it('returns false when users service responds 404', async () => {
    process.env.NODE_ENV = 'test';
    process.env.USERS_SERVICE_URL = 'http://users-service';
    process.env.INTERNAL_JWT_SECRET = 'internal-secret';

    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('service-token'),
    };
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      ok: false,
      json: jest.fn(),
    }) as typeof fetch;

    const provider = new HttpUserProvider(jwtService as unknown as JwtService);
    const result = await provider.verifyUserExists('missing-user');

    expect(result).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://users-service/users/missing-user/exists',
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('returns response exists flag when request succeeds', async () => {
    process.env.NODE_ENV = 'test';
    process.env.USERS_SERVICE_URL = 'http://users-service';
    process.env.INTERNAL_JWT_SECRET = 'internal-secret';

    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('service-token'),
    };
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue({ exists: true }),
    }) as typeof fetch;

    const provider = new HttpUserProvider(jwtService as unknown as JwtService);
    const result = await provider.verifyUserExists('known-user');

    expect(result).toBe(true);
  });
});

