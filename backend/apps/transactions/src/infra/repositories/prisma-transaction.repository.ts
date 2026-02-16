import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import type { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { prisma } from '../lib/prisma';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const data = TransactionMapper.toPersistence(transaction);
    const persisted = await prisma.transaction.create({ data });
    return TransactionMapper.toDomain(persisted);
  }

  async findById(id: string): Promise<Transaction | null> {
    const persisted = await prisma.transaction.findUnique({
      where: { id },
    });

    return persisted ? TransactionMapper.toDomain(persisted) : null;
  }

  async findByUserId(
    userId: string,
    type?: TransactionType,
  ): Promise<Transaction[]> {
    const persisted = await prisma.transaction.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return persisted.map(TransactionMapper.toDomain);
  }

  async calculateBalance(userId: string): Promise<bigint> {
    // aggregate transactions by type and sum amount of each type
    const aggregations = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amountCents: true,
      },
    });

    let balance = 0n;

    for (const agg of aggregations) {
      // prisma returns null if there are no transactions for that type, so default to 0n
      const sum = agg._sum.amountCents ?? 0n;

      // sum amount of each type in memory when iterating over the aggregations
      if (agg.type === TransactionType.CREDIT) {
        balance += sum;
      } else if (agg.type === TransactionType.DEBIT) {
        balance -= sum;
      }
    }

    return balance;
  }
}
