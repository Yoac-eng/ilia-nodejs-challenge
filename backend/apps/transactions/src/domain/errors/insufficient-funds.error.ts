import { DomainError } from './domain.error';

export class InsufficientFundsError extends DomainError {
  constructor() {
    super('Insufficient funds for this debit operation');
  }
}
