"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { AddFundsForm, WithdrawFundsForm } from "./wallet-forms";
import { walletQueryKeys } from "../hooks/use-wallet-transaction";

export function WalletActions() {
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  function handleSuccess(type: "credit" | "debit") {
    if (type === "credit") setIsAddOpen(false);
    if (type === "debit") setIsWithdrawOpen(false);

    // after success, invalidate the balance and transactions queries (cleans the cache)
    void queryClient.invalidateQueries({ queryKey: walletQueryKeys.balance });
    void queryClient.invalidateQueries({ queryKey: walletQueryKeys.transactions });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* add funds */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 " type="button">
            <Plus className="h-4 w-4" />
            Add funds
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add funds to your wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet.
            </DialogDescription>
          </DialogHeader>

          <AddFundsForm onSuccess={() => handleSuccess("credit")} />
        </DialogContent>
      </Dialog>

      {/* withdraw funds */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2" variant="outline" type="button">
            <Minus className="h-4 w-4" />
            Withdraw
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Withdraw from your wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw from your wallet.
            </DialogDescription>
          </DialogHeader>

          <WithdrawFundsForm onSuccess={() => handleSuccess("debit")} />
        </DialogContent>
      </Dialog>
    </div>
  );
}


