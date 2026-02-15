import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enum/transaction-type.enum';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string, type?: TransactionType): Promise<Transaction[]>;
  getBalance(userId: string): Promise<number>;
}
