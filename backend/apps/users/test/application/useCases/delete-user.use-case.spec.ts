import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';
import { DeleteUserUseCase } from '../../../src/application/useCases/delete-user.use-case';

describe('DeleteUserUseCase', () => {
  it('deletes an existing user', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue({ id: 'user-id' }),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new DeleteUserUseCase(
      userRepository as unknown as IUserRepository,
    );

    await useCase.execute({ id: 'user-id' });

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(userRepository.delete).toHaveBeenCalledWith('user-id');
  });

  it('throws when user does not exist', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
    };
    const useCase = new DeleteUserUseCase(
      userRepository as unknown as IUserRepository,
    );

    await expect(useCase.execute({ id: 'missing-id' })).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});

