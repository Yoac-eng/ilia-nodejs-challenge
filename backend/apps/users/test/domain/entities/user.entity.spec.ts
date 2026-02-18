import { Email } from '../../../src/domain/value-objects/email.value-object';
import { User } from '../../../src/domain/entities/user.entity';

describe('User', () => {
  it('creates user and serializes without passwordHash', () => {
    const user = User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('john@example.com'),
      passwordHash: 'hash',
    });

    const json = user.toJson();
    expect(json).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });
    expect(json).not.toHaveProperty('passwordHash');
  });

  it('throws when first name is missing', () => {
    expect(() =>
      User.create({
        firstName: '',
        lastName: 'Doe',
        email: new Email('john@example.com'),
        passwordHash: 'hash',
      }),
    ).toThrow('First name is required');
  });
});

