import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';

interface GetTransactionsInput {
  userId: string;
  type?: TransactionType;
}

export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userProvider: IUserProvider,
  ) {}

  async execute(input: GetTransactionsInput): Promise<Transaction[]> {
    await this.validateUser(input.userId);

    return await this.transactionRepository.findByUserId(
      input.userId,
      input.type,
    );
  }

  private async validateUser(userId: string): Promise<void> {
    const doesUserExist = await this.userProvider.verifyUserExists(userId);
    if (!doesUserExist) {
      throw new EntityNotFoundError('User');
    }
  }
}
