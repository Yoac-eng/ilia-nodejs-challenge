"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateTransactionInput, createTransactionSchema } from "../schemas/transaction.schema";
import { Field, FieldLabel, FieldMessage } from "@/ui/field";
import { useCreateTransaction } from "../hooks/use-wallet-transaction";
import { Button } from "@/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";
import { DollarSignIcon, MessageCircleIcon } from "lucide-react";

type CreateTransactionFormInput = z.input<typeof createTransactionSchema>;

type BaseFormProps = {
  onSuccess?: () => void;
};

function BaseTransactionForm({
  type,
  submitLabel,
  submitLoadingLabel,
  amountPlaceholder,
  descriptionPlaceholder,
  onSuccess,
}: {
  type: CreateTransactionInput["type"];
  submitLabel: string;
  submitLoadingLabel: string;
  amountPlaceholder: string;
  descriptionPlaceholder: string;
  onSuccess?: () => void;
}) {
  const createTransactionMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormInput, unknown, CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      amount: 0,
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createTransactionMutation.mutateAsync(values);
    onSuccess?.();
  });

  const isLoading = isSubmitting || createTransactionMutation.isPending;

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      {createTransactionMutation.error instanceof Error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {createTransactionMutation.error.message}
        </div>
      )}

      <Field>
        <FieldLabel htmlFor="amount">Amount</FieldLabel>
        <InputGroup className={errors.amount ? "border-destructive" : undefined}>
          <InputGroupAddon>
            <DollarSignIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder={amountPlaceholder}
            {...register("amount", { valueAsNumber: true })}
          />
        </InputGroup>
        {errors.amount?.message && <FieldMessage>{errors.amount.message}</FieldMessage>}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <InputGroup className={errors.description ? "border-destructive" : undefined}>
          <InputGroupAddon>
            <MessageCircleIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="description"
            type="text"
            placeholder={descriptionPlaceholder}
            autoComplete="off"
            {...register("description")}
          />
        </InputGroup>
        {errors.description?.message && (
          <FieldMessage>{errors.description.message}</FieldMessage>
        )}
      </Field>

      <Button type="submit" className="w-full my-4" disabled={isLoading}>
        {isLoading ? submitLoadingLabel : submitLabel}
      </Button>
    </form>
  );
}

export function AddFundsForm(props: BaseFormProps) {
  return (
    <BaseTransactionForm
      type="credit"
      submitLabel="Add funds"
      submitLoadingLabel="Adding funds..."
      amountPlaceholder="0.00"
      descriptionPlaceholder="Optional description"
      {...props}
    />
  );
}

export function WithdrawFundsForm(props: BaseFormProps) {
  return (
    <BaseTransactionForm
      type="debit"
      submitLabel="Withdraw"
      submitLoadingLabel="Withdrawing..."
      amountPlaceholder="0.00"
      descriptionPlaceholder="Optional description"
      {...props}
    />
  );
}
