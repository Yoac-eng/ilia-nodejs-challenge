import { Prisma } from '@generated/clients/transactions';
import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { InsufficientFundsError } from '../../domain/errors/insufficient-funds.error';
import type { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { prisma } from '../lib/prisma';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  /**
   * @param transaction - Creates a new transaction, register ledger entry and update account balance.
   * The whole operation is atomic and will fail if the account balance is insufficient or some other error occurs.
   * @returns The created transaction. If the operation fails, the transaction will not be created and the account balance will not be updated.
   */
  async create(transaction: Transaction): Promise<Transaction> {
    const signedAmountCents =
      transaction.type === TransactionType.CREDIT
        ? transaction.amount.toRaw()
        : -transaction.amount.toRaw();

    const persisted = await prisma.$transaction(
      async (tx) => {
        await tx.accountBalance.upsert({
          where: { userId: transaction.userId },
          // if new user, create a new account balance
          create: {
            userId: transaction.userId,
            balanceCents: 0n,
            updatedAt: transaction.createdAt,
          },
          // if existing user, do nothing
          update: {},
        });

        // get the current balance while row locking - FOR UPDATE (preventing race condition)
        const balances = await tx.$queryRaw<{ balance_cents: bigint }[]>`
          SELECT "balance_cents"
          FROM "account_balances"
          WHERE "user_id" = ${transaction.userId}
          FOR UPDATE
        `;

        const currentBalanceCents = balances[0]?.balance_cents ?? 0n;
        const runningBalanceCents = currentBalanceCents + signedAmountCents;

        if (runningBalanceCents < 0n) {
          throw new InsufficientFundsError();
        }

        const data = TransactionMapper.toPersistence(transaction);
        const createdTransaction = await tx.transaction.create({ data });

        await tx.ledgerEntry.create({
          data: {
            id: createdTransaction.id,
            transactionId: createdTransaction.id,
            userId: createdTransaction.userId,
            direction: createdTransaction.type,
            amountCents: createdTransaction.amountCents,
            signedAmountCents,
            runningBalanceCents,
            createdAt: createdTransaction.createdAt,
          },
        });

        await tx.accountBalance.update({
          where: { userId: transaction.userId },
          data: {
            balanceCents: runningBalanceCents,
            updatedAt: createdTransaction.createdAt,
          },
        });

        return createdTransaction;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

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
    const accountBalance = await prisma.accountBalance.findUnique({
      where: { userId },
      select: { balanceCents: true },
    });

    return accountBalance?.balanceCents ?? 0n;
  }
}
