"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateTransactionInput } from "../schemas/transaction.schema";
import { appApiRequest } from "@/lib/api-client";
import { WalletBalance, WalletTransaction } from "../types/wallet";

// react query uses query keys to handle caching and refetching of data
export const walletQueryKeys = {
  balance: ["balance"] as const,
  transactions: ["transactions"] as const,
};

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (values: CreateTransactionInput) => {
      return appApiRequest<WalletTransaction>({
        path: "/api/wallet/transactions",
        method: "POST",
        body: values,
      });
    },
  });
}

export function useWalletBalanceQuery(initialData?: WalletBalance) {
  return useQuery({
    queryKey: walletQueryKeys.balance,
    queryFn: () => appApiRequest<WalletBalance>({ path: "/api/wallet/balance" }),
    initialData,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
}

export function useWalletTransactionsQuery(initialData?: WalletTransaction[]) {
  return useQuery({
    queryKey: walletQueryKeys.transactions,
    queryFn: () => appApiRequest<WalletTransaction[]>({ path: "/api/wallet/transactions" }),
    initialData,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
}

