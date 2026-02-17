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

type WalletActionCopy = {
  addFunds: string;
  addFundsTitle: string;
  addFundsDescription: string;
  withdraw: string;
  withdrawTitle: string;
  withdrawDescription: string;
  amountLabel: string;
  descriptionLabel: string;
  optionalDescriptionPlaceholder: string;
  addingFunds: string;
  withdrawing: string;
};

export function WalletActions({ copy }: { copy: WalletActionCopy }) {
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  function handleSuccess(type: "CREDIT" | "DEBIT") {
    if (type === "CREDIT") setIsAddOpen(false);
    if (type === "DEBIT") setIsWithdrawOpen(false);

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
            {copy.addFunds}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{copy.addFundsTitle}</DialogTitle>
            <DialogDescription>
              {copy.addFundsDescription}
            </DialogDescription>
          </DialogHeader>

          <AddFundsForm copy={copy} onSuccess={() => handleSuccess("CREDIT")} />
        </DialogContent>
      </Dialog>

      {/* withdraw funds */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2" variant="outline" type="button">
            <Minus className="h-4 w-4" />
            {copy.withdraw}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{copy.withdrawTitle}</DialogTitle>
            <DialogDescription>
              {copy.withdrawDescription}
            </DialogDescription>
          </DialogHeader>

          <WithdrawFundsForm copy={copy} onSuccess={() => handleSuccess("DEBIT")} />
        </DialogContent>
      </Dialog>
    </div>
  );
}


