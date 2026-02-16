import { User } from '../../entities/user.entity';
import { Email } from '../../value-objects/email.value-object';

export interface IUserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  delete(id: string): Promise<void>;
}
