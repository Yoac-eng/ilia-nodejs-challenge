import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enum/transaction-type.enum';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string, type?: TransactionType): Promise<Transaction[]>;
  calculateBalance(userId: string): Promise<number>;
}
