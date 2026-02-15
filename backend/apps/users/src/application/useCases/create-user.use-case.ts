import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import type { IHashProvider } from '../../domain/interfaces/providers/hash.provider.interface';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashProvider') private readonly hashProvider: IHashProvider,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = new Email(input.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const passwordHash = await this.hashProvider.hash(input.password);

    const user = User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      passwordHash,
    });

    await this.userRepository.create(user);

    return user;
  }
}
