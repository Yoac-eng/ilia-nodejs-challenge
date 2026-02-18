import { GetAllUsersUseCase } from '../../../src/application/useCases/get-all-users.use-case';
import type { IUserRepository } from '../../../src/domain/interfaces/repositories/user.repository.interface';

describe('GetAllUsersUseCase', () => {
  it('returns all users from repository', async () => {
    const users = [{ id: 'u1' }, { id: 'u2' }];
    const userRepository = {
      findAll: jest.fn().mockResolvedValue(users),
    };
    const useCase = new GetAllUsersUseCase(
      userRepository as unknown as IUserRepository,
    );

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });
});

