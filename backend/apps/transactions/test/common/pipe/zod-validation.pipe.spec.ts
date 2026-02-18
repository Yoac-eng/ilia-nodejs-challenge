import { z } from 'zod';

import { ZodValidationPipe } from '../../../src/common/pipe/zod-validation.pipe';

describe('ZodValidationPipe (transactions)', () => {
  const schema = z.object({
    amount: z.number().int().min(0),
  });

  it('returns parsed value for valid payload', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(pipe.transform({ amount: 10 })).toEqual({ amount: 10 });
  });

  it('throws for invalid payload', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(() => pipe.transform({ amount: -1 })).toThrow();
  });
});

