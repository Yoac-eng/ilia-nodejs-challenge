import { Transaction } from '../../../src/domain/entities/transaction.entity';
import { TransactionType } from '../../../src/domain/enum/transaction-type.enum';
import { EntityNotFoundError } from '../../../src/domain/errors/entity-not-found.error';
import { InsufficientFundsError } from '../../../src/domain/errors/insufficient-funds.error';
import type { ITransactionRepository } from '../../../src/domain/interfaces/repositories/transaction.repository.interface';
import { CreateTransactionUseCase } from '../../../src/application/useCases/create-transaction.use-case';

describe('CreateTransactionUseCase', () => {
  it('creates a transaction when user exists and operation is valid', async () => {
    const transactionRepository = {
      calculateBalance: jest.fn().mockResolvedValue(1000n),
      create: jest.fn().mockImplementation(async (tx: Transaction) => tx),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(true),
    };
    const useCase = new CreateTransactionUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    const result = await useCase.execute({
      userId: 'user-id',
      type: TransactionType.DEBIT,
      amount: 500,
      idempotencyKey: 'idem-1',
      description: 'payment',
    });

    expect(userProvider.verifyUserExists).toHaveBeenCalledWith('user-id');
    expect(transactionRepository.calculateBalance).toHaveBeenCalledWith('user-id');
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.any(Transaction),
    );
    expect(result.userId).toBe('user-id');
    expect(result.amount.toRaw()).toBe(500n);
  });

  it('throws when user does not exist', async () => {
    const transactionRepository = {
      calculateBalance: jest.fn(),
      create: jest.fn(),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(false),
    };
    const useCase = new CreateTransactionUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    await expect(
      useCase.execute({
        userId: 'missing-user',
        type: TransactionType.CREDIT,
        amount: 100,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('throws for debit when funds are insufficient', async () => {
    const transactionRepository = {
      calculateBalance: jest.fn().mockResolvedValue(50n),
      create: jest.fn(),
    };
    const userProvider = {
      verifyUserExists: jest.fn().mockResolvedValue(true),
    };
    const useCase = new CreateTransactionUseCase(
      transactionRepository as unknown as ITransactionRepository,
      userProvider,
    );

    await expect(
      useCase.execute({
        userId: 'user-id',
        type: TransactionType.DEBIT,
        amount: 100,
      }),
    ).rejects.toBeInstanceOf(InsufficientFundsError);
    expect(transactionRepository.create).not.toHaveBeenCalled();
  });
});

