import { z } from 'zod';

export const createTransactionHeadersSchema = z
  .object({
    'x-idempotency-key': z
      .string()
      .min(1, 'Idempotency key cannot be empty')
      .max(255, 'Idempotency key is too long'),
  })
  .loose()
  .transform((data) => ({
    idempotencyKey: data['x-idempotency-key'],
  }));

export type CreateTransactionHeadersDto = z.infer<
  typeof createTransactionHeadersSchema
>;
