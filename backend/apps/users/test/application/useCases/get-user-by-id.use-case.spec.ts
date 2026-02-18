import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';
import { GetUserByIdUseCase } from '../../../src/application/useCases/get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  it('returns user when found', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue({ id: 'user-id' }),
    };
    const useCase = new GetUserByIdUseCase(
      userRepository as unknown as IUserRepository,
    );

    const result = await useCase.execute({ id: 'user-id' });

    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(result).toEqual({ id: 'user-id' });
  });

  it('throws when user does not exist', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetUserByIdUseCase(
      userRepository as unknown as IUserRepository,
    );

    await expect(useCase.execute({ id: 'missing-id' })).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
  });
});

