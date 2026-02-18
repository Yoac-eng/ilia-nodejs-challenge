import { Transaction } from '../../../src/domain/entities/transaction.entity';
import { TransactionType } from '../../../src/domain/enum/transaction-type.enum';
import { Amount } from '../../../src/domain/value-objects/amount.value-object';
import { TransactionMapper } from '../../../src/infra/mappers/transaction.mapper';

describe('TransactionMapper', () => {
  it('maps domain transaction to persistence', () => {
    const transaction = Transaction.reconstitute(
      {
        userId: 'user-id',
        type: TransactionType.DEBIT,
        description: 'purchase',
        amount: Amount.create(450),
        idempotencyKey: 'idem-1',
        createdAt: new Date('2024-01-01'),
      },
      'tx-id',
    );

    const persistence = TransactionMapper.toPersistence(transaction);

    expect(persistence).toMatchObject({
      id: 'tx-id',
      userId: 'user-id',
      type: TransactionType.DEBIT,
      description: 'purchase',
      amountCents: 450n,
      idempotencyKey: 'idem-1',
    });
  });

  it('maps persistence transaction to domain', () => {
    const domain = TransactionMapper.toDomain({
      id: 'tx-id',
      userId: 'user-id',
      type: TransactionType.CREDIT,
      description: null,
      amountCents: 200n,
      idempotencyKey: null,
      createdAt: new Date('2024-01-01'),
    });

    expect(domain.id).toBe('tx-id');
    expect(domain.amount.toRaw()).toBe(200n);
    expect(domain.type).toBe(TransactionType.CREDIT);
  });
});

