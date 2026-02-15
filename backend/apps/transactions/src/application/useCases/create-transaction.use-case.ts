import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { InsufficientFundsError } from '../../domain/errors/insufficient-funds.error';
import { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { Amount } from '../../domain/value-objects/amount.value-object';

interface CreateTransactionInput {
  userId: string;
  type: TransactionType;
  amount: number;
  idempotencyKey: string;
}

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userProvider: IUserProvider,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    await this.validateOperation(input);

    const transaction = Transaction.create({
      userId: input.userId,
      type: input.type,
      amount: Amount.create(input.amount),
      idempotencyKey: input.idempotencyKey,
    });

    return await this.transactionRepository.create(transaction);
  }

  // TODO: treat race condition to avoid duplicate transactions
  async validateOperation(input: CreateTransactionInput): Promise<void> {
    if (!(await this.userProvider.verifyUserExists(input.userId))) {
      throw new EntityNotFoundError('User');
    }

    if (input.type === TransactionType.DEBIT) {
      const currentBalance = await this.transactionRepository.calculateBalance(
        input.userId,
      );
      if (currentBalance < input.amount) {
        throw new InsufficientFundsError();
      }
    }
  }
}
