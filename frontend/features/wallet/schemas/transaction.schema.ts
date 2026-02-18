import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["CREDIT", "DEBIT"]),
  amount: z.number().min(0.01, "Amount must be at least $0.01."),
  description: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().min(3, "Description must be at least 3 characters.").optional()
  ), // allow empty string to be optional
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

