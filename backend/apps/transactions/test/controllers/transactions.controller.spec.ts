import { ForbiddenException } from '@nestjs/common';

import { CreateTransactionUseCase } from '../../src/application/useCases/create-transaction.use-case';
import { GetTransactionsUseCase } from '../../src/application/useCases/get-transactions.use-case';
import { TransactionType } from '../../src/domain/enum/transaction-type.enum';
import { Transaction } from '../../src/domain/entities/transaction.entity';
import { Amount } from '../../src/domain/value-objects/amount.value-object';
import { TransactionsController } from '../../src/controllers/transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createTransactionUseCase: { execute: jest.Mock };
  let getTransactionsUseCase: { execute: jest.Mock };

  beforeEach(() => {
    createTransactionUseCase = { execute: jest.fn() };
    getTransactionsUseCase = { execute: jest.fn() };
    controller = new TransactionsController(
      createTransactionUseCase as unknown as CreateTransactionUseCase,
      getTransactionsUseCase as unknown as GetTransactionsUseCase,
    );
  });

  describe('createTransaction', () => {
    it('throws when authenticated user differs from payload user', async () => {
      await expect(
        controller.createTransaction(
          { user_id: 'u-1', type: TransactionType.CREDIT, amount: 100 },
          'u-2',
          {},
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(createTransactionUseCase.execute).not.toHaveBeenCalled();
    });

    it('forwards payload and parsed idempotency key to use case', async () => {
      const transaction = Transaction.create({
        userId: 'u-1',
        type: TransactionType.CREDIT,
        amount: Amount.create(500),
        description: 'salary',
        idempotencyKey: 'idem-1',
      });
      createTransactionUseCase.execute.mockResolvedValue(transaction);

      const output = await controller.createTransaction(
        {
          user_id: 'u-1',
          type: TransactionType.CREDIT,
          amount: 500,
          description: 'salary',
        },
        'u-1',
        { 'x-idempotency-key': 'idem-1' },
      );

      expect(createTransactionUseCase.execute).toHaveBeenCalledWith({
        userId: 'u-1',
        type: TransactionType.CREDIT,
        amount: 500,
        idempotencyKey: 'idem-1',
        description: 'salary',
      });
      expect(output).toEqual(transaction.toJson());
    });
  });

  describe('getTransactions', () => {
    it('forwards authenticated user and optional type', async () => {
      const transaction = Transaction.create({
        userId: 'u-1',
        type: TransactionType.DEBIT,
        amount: Amount.create(100),
      });
      getTransactionsUseCase.execute.mockResolvedValue([transaction]);

      const output = await controller.getTransactions(
        { type: TransactionType.DEBIT },
        'u-1',
      );

      expect(getTransactionsUseCase.execute).toHaveBeenCalledWith({
        userId: 'u-1',
        type: TransactionType.DEBIT,
      });
      expect(output).toEqual([transaction.toJson()]);
    });
  });
});
