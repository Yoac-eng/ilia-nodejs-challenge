import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import type { ITransactionRepository } from '../../../src/domain/interfaces/repositories/transaction.repository.interface';
import { GetBalanceUseCase } from '../../../src/application/useCases/get-balance.use-case';

describe('GetBalanceUseCase', () => {
  it('returns user balance as Amount value object', async () => {
    const transactionRepository = {
      calculateBalance: jest.fn().mockResolvedValue(1200n),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(true),
    };
    const useCase = new GetBalanceUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    const result = await useCase.execute({ userId: 'user-id' });

    expect(userProvider.verifyUserExists).toHaveBeenCalledWith('user-id');
    expect(transactionRepository.calculateBalance).toHaveBeenCalledWith('user-id');
    expect(result.toRaw()).toBe(1200n);
  });

  it('throws when user does not exist', async () => {
    const transactionRepository = {
      calculateBalance: jest.fn(),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(false),
    };
    const useCase = new GetBalanceUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    await expect(useCase.execute({ userId: 'missing-user' })).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
    expect(transactionRepository.calculateBalance).not.toHaveBeenCalled();
  });
});

