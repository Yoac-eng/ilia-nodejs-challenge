"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateTransactionInput } from "../schemas/transaction.schema";
import { appApiRequest } from "@/lib/api-client";
import { TransactionType, WalletBalance, WalletTransaction } from "../types/wallet";

// react query uses query keys to handle caching and refetching of data
export const walletQueryKeys = {
  balance: ["balance"] as const,
  transactions: ["transactions"] as const,
};

// create a new transaction on client side
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

// get the balance from the wallet service on client side
export function useWalletBalanceQuery(initialData?: WalletBalance) {
  return useQuery({
    queryKey: walletQueryKeys.balance,
    queryFn: () => appApiRequest<WalletBalance>({ path: "/api/wallet/balance" }),
    initialData,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
}

// get the transactions from the wallet service on client side
export function useWalletTransactionsQuery(
  type: TransactionType | "ALL" = "ALL",
  initialData?: WalletTransaction[]
) {
  const path =
    type === "ALL" ? "/api/wallet/transactions" : `/api/wallet/transactions?type=${type}`;

  return useQuery({
    queryKey: [...walletQueryKeys.transactions, type],
    queryFn: () => appApiRequest<WalletTransaction[]>({ path }),
    initialData, // initial data is only used if the query is not already in the cache
    refetchOnWindowFocus: true, // refetch the query when the window is focused
    refetchInterval: 30_000, // refetch the query every 30 seconds
  });
}

