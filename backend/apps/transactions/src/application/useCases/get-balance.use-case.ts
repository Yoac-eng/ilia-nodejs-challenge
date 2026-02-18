import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import type { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';
import type { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { Amount } from '../../domain/value-objects/amount.value-object';

export interface GetBalanceInput {
  userId: string;
}

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IUserProvider')
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
