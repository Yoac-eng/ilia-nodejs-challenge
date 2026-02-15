import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';

export interface DeleteUserInput {
  id: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new EntityNotFoundError('User');
    }

    await this.userRepository.delete(input.id);
  }
}
