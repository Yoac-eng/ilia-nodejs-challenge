import { Transaction } from '../../../src/domain/entities/transaction.entity';
import { TransactionType } from '../../../src/domain/enum/transaction-type.enum';
import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import type { ITransactionRepository } from '../../../src/domain/interfaces/repositories/transaction.repository.interface';
import { Amount } from '../../../src/domain/value-objects/amount.value-object';
import { GetTransactionsUseCase } from '../../../src/application/useCases/get-transactions.use-case';

describe('GetTransactionsUseCase', () => {
  it('returns transactions for an existing user', async () => {
    const transactions = [
      Transaction.create({
        userId: 'user-id',
        type: TransactionType.CREDIT,
        amount: Amount.create(300),
      }),
    ];
    const transactionRepository = {
      findByUserId: jest.fn().mockResolvedValue(transactions),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(true),
    };
    const useCase = new GetTransactionsUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    const result = await useCase.execute({
      userId: 'user-id',
      type: TransactionType.CREDIT,
    });

    expect(userProvider.verifyUserExists).toHaveBeenCalledWith('user-id');
    expect(transactionRepository.findByUserId).toHaveBeenCalledWith(
      'user-id',
      TransactionType.CREDIT,
    );
    expect(result).toEqual(transactions);
  });

  it('throws when user does not exist', async () => {
    const transactionRepository = {
      findByUserId: jest.fn(),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(false),
    };
    const useCase = new GetTransactionsUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    await expect(useCase.execute({ userId: 'missing-user' })).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
    expect(transactionRepository.findByUserId).not.toHaveBeenCalled();
  });
});

