"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { WalletActions } from "./wallet-actions";
import {
  useWalletBalanceQuery,
  useWalletTransactionsQuery,
} from "../hooks/use-wallet-transaction";
import { WalletBalance, WalletTransaction } from "../types/wallet";

type WalletOverviewProps = {
  initialBalance: WalletBalance;
  initialTransactions: WalletTransaction[];
};

function dollarsFromCents(value: number): number {
  return value / 100;
}

export function WalletOverview({
  initialBalance,
  initialTransactions,
}: WalletOverviewProps) {
  const balanceQuery = useWalletBalanceQuery(initialBalance);
  const transactionsQuery = useWalletTransactionsQuery(initialTransactions);

  const balanceInDollars = dollarsFromCents(balanceQuery.data?.amount ?? 0);
  const transactions = transactionsQuery.data ?? [];

  return (
    <div className="space-y-6 pt-16">
      <Card className="border-primary/20 bg-linear-to-br from-primary/15 via-background to-accent/10">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">Wallet</CardTitle>
            <CardDescription className="mt-2">Available balance</CardDescription>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatCurrency(balanceInDollars)}
            </p>
            {balanceQuery.isFetching && (
              <p className="mt-2 text-xs text-muted-foreground">Updating balance...</p>
            )}
            {balanceQuery.error instanceof Error && (
              <p className="mt-2 text-xs text-destructive">{balanceQuery.error.message}</p>
            )}
          </div>

          <WalletActions />
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Account Activities</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsQuery.error instanceof Error && (
              <p className="text-sm text-destructive">{transactionsQuery.error.message}</p>
            )}
            {!transactionsQuery.error && transactions.length === 0 && (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            )}
            {transactions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-muted-foreground">
                    <tr className="border-b">
                      <th className="px-2 py-2 font-medium">Description</th>
                      <th className="px-2 py-2 font-medium">Type</th>
                      <th className="px-2 py-2 font-medium">Date</th>
                      <th className="px-2 py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const isCredit = transaction.type === "credit";
                      return (
                        <tr key={transaction.id} className="border-b last:border-0">
                          <td className="px-2 py-3">
                            {transaction.description?.trim() || "Transaction"}
                          </td>
                          <td className="px-2 py-3 capitalize">{transaction.type}</td>
                          <td className="px-2 py-3 text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-2 py-3 text-right">
                            <span
                              className={
                                isCredit
                                  ? "inline-flex items-center gap-1 text-emerald-400"
                                  : "inline-flex items-center gap-1 text-rose-400"
                              }
                            >
                              {isCredit ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDownLeft className="h-3.5 w-3.5" />
                              )}
                              {formatCurrency(dollarsFromCents(Math.abs(transaction.amount)))}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

