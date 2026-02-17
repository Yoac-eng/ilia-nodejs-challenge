"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LockIcon, MailIcon } from "lucide-react";

import { useRegister } from "@/features/auth/hooks/use-register";
import {
  type RegisterInput,
  registerSchema,
} from "@/features/auth/schemas/auth.schema";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Field, FieldLabel, FieldMessage } from "@/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";

type RegisterFormCopy = {
  accountCreatedTitle: string;
  accountCreatedDescription: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  createPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  creatingAccount: string;
  getStarted: string;
  alreadyHaveAccount: string;
  signIn: string;
};

export function RegisterForm({ locale, copy }: { locale: string; copy: RegisterFormCopy }) {
  const router = useRouter();
  const registerMutation = useRegister();
  const { success } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values);
    success(copy.accountCreatedTitle, {
      description: copy.accountCreatedDescription,
    });
    router.push(`/${locale}/login`);
  });

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      {registerMutation.error instanceof Error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {registerMutation.error.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <Field>
          <FieldLabel htmlFor="name">{copy.firstNameLabel}</FieldLabel>
          <Input
            id="name"
            placeholder={copy.firstNamePlaceholder}
            {...register("name")}
          />
          {errors.name?.message && (
            <FieldMessage>{errors.name.message}</FieldMessage>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">{copy.lastNameLabel}</FieldLabel>
          <Input
            id="lastName"
            placeholder={copy.lastNamePlaceholder}
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <FieldMessage>{errors.lastName.message}</FieldMessage>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">{copy.emailLabel}</FieldLabel>
        <InputGroup className={errors.email ? "border-destructive" : undefined}>
          <InputGroupAddon>
            <MailIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            type="email"
            placeholder={copy.emailPlaceholder}
            autoComplete="email"
            {...register("email")}
          />
        </InputGroup>
        {errors.email?.message && <FieldMessage>{errors.email.message}</FieldMessage>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">{copy.passwordLabel}</FieldLabel>
        <InputGroup
          className={errors.password ? "border-destructive" : undefined}
        >
          <InputGroupAddon>
            <LockIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            type="password"
            placeholder={copy.createPasswordPlaceholder}
            autoComplete="new-password"
            {...register("password")}
          />
        </InputGroup>
        {errors.password?.message && (
          <FieldMessage>{errors.password.message}</FieldMessage>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">{copy.confirmPasswordLabel}</FieldLabel>
        <InputGroup
          className={errors.confirmPassword ? "border-destructive" : undefined}
        >
          <InputGroupAddon>
            <LockIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="confirmPassword"
            type="password"
            placeholder={copy.confirmPasswordPlaceholder}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </InputGroup>
        {errors.confirmPassword?.message && (
          <FieldMessage>{errors.confirmPassword.message}</FieldMessage>
        )}
      </Field>

      <Button
        type="submit"
        className="my-4 w-full"
        disabled={isSubmitting || registerMutation.isPending}
      >
        {isSubmitting || registerMutation.isPending
          ? copy.creatingAccount
          : copy.getStarted}
      </Button>
      <p className="text-sm text-muted-foreground">
        {copy.alreadyHaveAccount}{" "}
        <Link href={`/${locale}/login`} className="underline">
          {copy.signIn}
        </Link>
      </p>
    </form>
  );
}

