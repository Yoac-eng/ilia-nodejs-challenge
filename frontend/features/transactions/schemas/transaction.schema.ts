import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["credit", "debit"]),
  amount: z.number().positive("Amount must be greater than zero."),
  description: z.optional(z.string().min(2, "Description is required.")),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

