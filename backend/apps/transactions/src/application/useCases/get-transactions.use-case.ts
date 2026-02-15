import { Inject, Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import type { IUserProvider } from '../../domain/interfaces/providers/user.provider.interface';
import type { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';

export interface GetTransactionsInput {
  userId: string;
  type?: TransactionType;
}

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IUserProvider') private readonly userProvider: IUserProvider,
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
