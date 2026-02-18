import { TransactionType } from '../../../src/domain/enum/transaction-type.enum';
import { Amount } from '../../../src/domain/value-objects/amount.value-object';
import { Transaction } from '../../../src/domain/entities/transaction.entity';

describe('Transaction', () => {
  it('creates and serializes a transaction', () => {
    const transaction = Transaction.create({
      userId: 'user-id',
      type: TransactionType.CREDIT,
      amount: Amount.create(100),
      description: 'salary',
    });

    expect(transaction.toJson()).toMatchObject({
      userId: 'user-id',
      type: TransactionType.CREDIT,
      amount: 100,
      description: 'salary',
    });
  });

  it('throws when user id is missing', () => {
    expect(() =>
      Transaction.create({
        userId: '',
        type: TransactionType.CREDIT,
        amount: Amount.create(100),
      }),
    ).toThrow('User ID is required');
  });
});

