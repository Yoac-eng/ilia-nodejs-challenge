import { User } from '../../../src/domain/entities/user.entity';
import { InvalidCredentialsError } from '../../../src/domain/errors/invalid-credentials.error';
import type { IHashProvider } from '../../../src/domain/interfaces/providers/hash.provider.interface';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../../src/domain/value-objects/email.value-object';
import { AuthenticateUserUseCase } from '../../../src/application/useCases/authenticate-user.use-case';

describe('AuthenticateUserUseCase', () => {
  const user = User.reconstitute(
    {
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('john@example.com'),
      passwordHash: 'hashed-password',
      createdAt: new Date('2024-01-01'),
    },
    'user-id',
  );

  it('returns authenticated user and signed token', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(user),
    };
    const hashProvider = {
      compare: jest.fn().mockResolvedValue(true),
    };
    const tokenProvider = {
      sign: jest.fn().mockReturnValue('token-123'),
    };
    const useCase = new AuthenticateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
      tokenProvider,
    );

    const output = await useCase.execute({
      email: 'john@example.com',
      password: 'secret',
    });

    expect(hashProvider.compare).toHaveBeenCalledWith('secret', 'hashed-password');
    expect(tokenProvider.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'john@example.com',
    });
    expect(output).toEqual({ user, accessToken: 'token-123' });
  });

  it('throws for unknown user', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
    };
    const hashProvider = {
      compare: jest.fn(),
    };
    const tokenProvider = {
      sign: jest.fn(),
    };
    const useCase = new AuthenticateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
      tokenProvider,
    );

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'secret' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(hashProvider.compare).not.toHaveBeenCalled();
    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });

  it('throws for invalid password', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(user),
    };
    const hashProvider = {
      compare: jest.fn().mockResolvedValue(false),
    };
    const tokenProvider = {
      sign: jest.fn(),
    };
    const useCase = new AuthenticateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
      tokenProvider,
    );

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });
});

