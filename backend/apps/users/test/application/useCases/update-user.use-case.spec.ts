import { User } from '../../../src/domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../../src/domain/errors/email-already-in-use.error';
import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import type { IHashProvider } from '../../../src/domain/interfaces/providers/hash.provider.interface';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../../src/domain/value-objects/email.value-object';
import { UpdateUserUseCase } from '../../../src/application/useCases/update-user.use-case';

describe('UpdateUserUseCase', () => {
  const existingUser = User.reconstitute(
    {
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('john@example.com'),
      passwordHash: 'old-hash',
      createdAt: new Date('2024-01-01'),
    },
    'user-id',
  );

  it('updates fields and hashes new password when provided', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue(existingUser),
      findByEmail: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const hashProvider = {
      hash: jest.fn().mockResolvedValue('new-hash'),
    };
    const useCase = new UpdateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
    );

    const result = await useCase.execute({
      id: 'user-id',
      firstName: 'Johnny',
      email: 'johnny@example.com',
      password: 'new-secret',
    });

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      new Email('johnny@example.com'),
    );
    expect(hashProvider.hash).toHaveBeenCalledWith('new-secret');
    expect(userRepository.update).toHaveBeenCalledWith(expect.any(User));
    expect(result.firstName).toBe('Johnny');
    expect(result.email.toString()).toBe('johnny@example.com');
    expect(result.passwordHash).toBe('new-hash');
  });

  it('throws when user does not exist', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };
    const hashProvider = {
      hash: jest.fn(),
    };
    const useCase = new UpdateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
    );

    await expect(useCase.execute({ id: 'missing-id' })).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('throws when new email belongs to another user', async () => {
    const conflictingUser = User.reconstitute(
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: new Email('jane@example.com'),
        passwordHash: 'hash',
        createdAt: new Date('2024-01-01'),
      },
      'other-user-id',
    );
    const userRepository = {
      findById: jest.fn().mockResolvedValue(existingUser),
      findByEmail: jest.fn().mockResolvedValue(conflictingUser),
      update: jest.fn(),
    };
    const hashProvider = {
      hash: jest.fn(),
    };
    const useCase = new UpdateUserUseCase(
      userRepository as unknown as IUserRepository,
      hashProvider as unknown as IHashProvider,
    );

    await expect(
      useCase.execute({ id: 'user-id', email: 'jane@example.com' }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});

