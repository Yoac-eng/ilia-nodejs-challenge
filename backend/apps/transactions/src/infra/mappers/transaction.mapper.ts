import type { Transaction as PrismaTransaction } from '@generated/clients/transactions';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { Amount } from '../../domain/value-objects/amount.value-object';

function mapType(type: string): TransactionType {
  if (type === TransactionType.CREDIT || type === TransactionType.DEBIT) {
    return type;
  }

  throw new Error(`Invalid transaction type from persistence: ${type}`);
}

export class TransactionMapper {
  public static toPersistence(
    domainTransaction: Transaction,
  ): PrismaTransaction {
    return {
      id: domainTransaction.id,
      userId: domainTransaction.userId,
      type: domainTransaction.type,
      description: domainTransaction.description ?? null,
      amountCents: domainTransaction.amount.toRaw(),
      idempotencyKey: domainTransaction.idempotencyKey ?? null,
      createdAt: domainTransaction.createdAt,
    };
  }

  public static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.reconstitute(
      {
        userId: raw.userId,
        type: mapType(raw.type),
        description: raw.description ?? undefined,
        amount: Amount.fromRaw(raw.amountCents),
        idempotencyKey: raw.idempotencyKey ?? undefined,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
