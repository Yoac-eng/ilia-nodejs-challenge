import { Amount } from '../../../src/domain/value-objects/amount.value-object';

describe('Amount', () => {
  it('creates amount from integer cents', () => {
    const amount = Amount.create(123);
    expect(amount.toRaw()).toBe(123n);
    expect(amount.toString()).toBe('123');
  });

  it('throws for non-integer values', () => {
    expect(() => Amount.create(1.5)).toThrow('Amount must be an integer (cents)');
  });

  it('throws for negative values', () => {
    expect(() => Amount.create(-1)).toThrow('Amount cannot be negative');
  });

  it('creates amount from raw bigint', () => {
    const amount = Amount.fromRaw(999n);
    expect(amount.toRaw()).toBe(999n);
    expect(amount.cents).toBe(999n);
  });

  it('creates amount from numeric string', () => {
    const amount = Amount.fromString('456');
    expect(amount.toRaw()).toBe(456n);
  });

  it('throws for negative raw bigint', () => {
    expect(() => Amount.fromRaw(-10n)).toThrow('Amount cannot be negative');
  });
});

