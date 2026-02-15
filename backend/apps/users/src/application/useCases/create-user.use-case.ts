import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import { IHashProvider } from '../../domain/interfaces/providers/hash.provider.interface';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
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
