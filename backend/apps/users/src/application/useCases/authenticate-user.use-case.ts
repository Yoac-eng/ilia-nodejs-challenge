import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import type { IHashProvider } from '../../domain/interfaces/providers/hash.provider.interface';
import type { ITokenProvider } from '../../domain/interfaces/providers/token.provider.interface';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  user: User;
  accessToken: string;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashProvider') private readonly hashProvider: IHashProvider,
    @Inject('ITokenProvider') private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByEmail(new Email(input.email));
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await this.hashProvider.compare(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenProvider.sign({
      sub: user.id,
      email: user.email.toString(),
    });

    return { user, accessToken };
  }
}
