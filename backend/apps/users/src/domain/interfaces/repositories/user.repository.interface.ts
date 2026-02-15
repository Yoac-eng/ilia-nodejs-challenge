import { User } from '../../entities/user.entity';
import { Email } from '../../value-objects/email.value-object';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
}
