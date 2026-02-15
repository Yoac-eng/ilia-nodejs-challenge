import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { Amount } from '../../domain/value-objects/amount.value-object';

interface GetBalanceInput {
  userId: string;
}

export class GetBalanceUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userProvider: IUserProvider,
  ) {}

  async execute(input: GetBalanceInput): Promise<Amount> {
    await this.validateUser(input.userId);

    const balance = await this.transactionRepository.calculateBalance(
      input.userId,
    );

    return Amount.fromRaw(balance);
  }

  private async validateUser(userId: string): Promise<void> {
    const doesUserExist = await this.userProvider.verifyUserExists(userId);
    if (!doesUserExist) {
      throw new EntityNotFoundError('User');
    }
  }
}
