export type TransactionType = "credit" | "debit";

export type WalletBalance = {
  amount: number;
};

export type WalletTransaction = {
  id: string;
  userId: string;
  type: TransactionType;
  description?: string;
  amount: number;
  createdAt: string;
};

export type CreateWalletTransactionRequest = {
  type: TransactionType;
  amount: number;
  description?: string;
};

