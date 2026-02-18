import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import type { IHashProvider } from '../../domain/interfaces/providers/hash.provider.interface';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashProvider') private readonly hashProvider: IHashProvider,
  ) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new EntityNotFoundError('User');
    }

    const email =
      typeof input.email === 'string' ? new Email(input.email) : user.email;

    if (!email.equals(user.email)) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        throw new EmailAlreadyInUseError();
      }
    }

    const passwordHash =
      typeof input.password === 'string'
        ? await this.hashProvider.hash(input.password)
        : user.passwordHash;

    const updatedUser = User.reconstitute(
      {
        firstName: input.firstName ?? user.firstName,
        lastName: input.lastName ?? user.lastName,
        email,
        passwordHash,
        createdAt: user.createdAt,
      },
      user.id,
    );

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}
