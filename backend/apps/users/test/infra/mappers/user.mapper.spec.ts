import { UserMapper } from '../../../src/infra/mappers/user.mapper';
import { User } from '../../../src/domain/entities/user.entity';
import { Email } from '../../../src/domain/value-objects/email.value-object';

describe('UserMapper', () => {
  it('maps domain user to persistence format', () => {
    const user = User.reconstitute(
      {
        firstName: 'John',
        lastName: 'Doe',
        email: new Email('john@example.com'),
        passwordHash: 'hash',
        createdAt: new Date('2024-01-01'),
      },
      'user-id',
    );

    const persistence = UserMapper.toPersistence(user);

    expect(persistence).toMatchObject({
      id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: 'hash',
    });
  });

  it('maps persistence user back to domain', () => {
    const domain = UserMapper.toDomain({
      id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: 'hash',
      createdAt: new Date('2024-01-01'),
    });

    expect(domain.id).toBe('user-id');
    expect(domain.email.toString()).toBe('john@example.com');
  });
});

