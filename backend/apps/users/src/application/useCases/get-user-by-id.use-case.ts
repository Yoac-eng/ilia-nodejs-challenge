import { User } from '../../domain/entities/user.entity';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';

export interface GetUserByIdInput {
  id: string;
}

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserByIdInput): Promise<User> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return user;
  }
}
