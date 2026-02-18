import { z } from 'zod';

import { ZodValidationPipe } from '../../../src/common/pipe/zod-validation.pipe';

describe('ZodValidationPipe (users)', () => {
  const schema = z.object({
    name: z.string().min(1),
  });

  it('returns parsed value for valid payload', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(pipe.transform({ name: 'John' })).toEqual({ name: 'John' });
  });

  it('throws for invalid payload', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(() => pipe.transform({ name: '' })).toThrow();
  });
});

