import { DomainError } from './domain.error';

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string) {
    super(`${entityName} was not found.`);
  }
}
