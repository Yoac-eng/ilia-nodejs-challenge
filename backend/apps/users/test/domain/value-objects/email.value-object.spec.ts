import { Email } from '../../../src/domain/value-objects/email.value-object';

describe('Email', () => {
  it('normalizes to lowercase', () => {
    const email = new Email('USER@Example.COM');
    expect(email.value).toBe('user@example.com');
  });

  it('throws for invalid format', () => {
    expect(() => new Email('not-an-email')).toThrow('Invalid email format');
  });

  it('compares by normalized value', () => {
    const first = new Email('John@Example.com');
    const second = new Email('john@example.com');
    expect(first.equals(second)).toBe(true);
  });
});

