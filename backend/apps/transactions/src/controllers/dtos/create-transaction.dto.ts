import { z } from 'zod';

import { TransactionType } from '../../domain/enum/transaction-type.enum';

export const createTransactionSchema = z.object({
  user_id: z.uuid('Invalid user id format'),
  type: z.enum(TransactionType),
  amount: z
    .int('Amount must be an integer')
    .min(0, 'Amount cannot be negative'),
  description: z.string().max(255, 'Description is too long').optional(),
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
