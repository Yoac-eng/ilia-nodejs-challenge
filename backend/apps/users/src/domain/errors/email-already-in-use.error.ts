import { DomainError } from './domain.error';

export class EmailAlreadyInUseError extends DomainError {
  constructor() {
    super('Email already in use.');
  }
}
