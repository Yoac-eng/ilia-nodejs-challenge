import { AuthenticateUserUseCase } from '../../src/application/useCases/authenticate-user.use-case';
import { User } from '../../src/domain/entities/user.entity';
import { Email } from '../../src/domain/value-objects/email.value-object';
import { toSnakeCaseDeep } from '../../src/common/utils/case.util';

import { AuthController } from '../../src/controllers/auth.controller';

describe('AuthController', () => {
  it('returns serialized user and snake_case token field', async () => {
    const user = User.reconstitute(
      {
        firstName: 'John',
        lastName: 'Doe',
        email: new Email('john@example.com'),
        passwordHash: 'hash',
        createdAt: new Date('2024-01-01'),
      },
      'user-id',
    );
    const authenticateUserUseCase = {
      execute: jest.fn().mockResolvedValue({
        user,
        accessToken: 'token-123',
      }),
    };
    const controller = new AuthController(
      authenticateUserUseCase as unknown as AuthenticateUserUseCase,
    );

    const result = await controller.authenticate({
      email: 'john@example.com',
      password: 'secret',
    });

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret',
    });
    expect(toSnakeCaseDeep(result)).toEqual({
      user: toSnakeCaseDeep(user.toJson()),
      access_token: 'token-123',
    });
  });
});

