import { User } from '../../../src/domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../../src/domain/errors/email-already-in-use.error';
import type { IHashProvider } from '../../../src/domain/interfaces/providers/hash.provider.interface';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../../src/domain/value-objects/email.value-object';
import { CreateUserUseCase } from '../../../src/application/useCases/create-user.use-case';

describe('CreateUserUseCase', () => {
  it('creates a user with hashed password when email is available', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(undefined),
    };
    const hashProvider = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };
    const useCase = new CreateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
    );

    const result = await useCase.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      new Email('john@example.com'),
    );
    expect(hashProvider.hash).toHaveBeenCalledWith('secret');
    expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(result.email.toString()).toBe('john@example.com');
    expect(result.passwordHash).toBe('hashed-password');
  });

  it('throws when email is already in use', async () => {
    const existingUser = User.reconstitute(
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: new Email('jane@example.com'),
        passwordHash: 'hash',
        createdAt: new Date('2024-01-01'),
      },
      'user-id',
    );
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(existingUser),
      create: jest.fn(),
    };
    const hashProvider = {
      hash: jest.fn(),
    };
    const useCase = new CreateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
    );

    await expect(
      useCase.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
    expect(hashProvider.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

