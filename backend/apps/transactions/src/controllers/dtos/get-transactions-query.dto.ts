import { z } from 'zod';

import { TransactionType } from '../../domain/enum/transaction-type.enum';

export const getTransactionsQuerySchema = z.object({
  type: z.enum(TransactionType).optional(),
});

export type GetTransactionsQueryDto = z.infer<
  typeof getTransactionsQuerySchema
>;
