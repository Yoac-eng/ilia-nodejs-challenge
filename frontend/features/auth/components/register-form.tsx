"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";

import { useRegister } from "@/features/auth/hooks/use-register";
import {
  type RegisterInput,
  registerSchema,
} from "@/features/auth/schemas/auth.schema";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Field, FieldLabel, FieldMessage } from "@/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

    router.push("/login");
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
          <FieldLabel htmlFor="name">First Name</FieldLabel>
          <Input
            id="name"
            placeholder="Enter your first name"
            {...register("name")}
          />
          {errors.name?.message && (
            <FieldMessage>{errors.name.message}</FieldMessage>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <FieldMessage>{errors.lastName.message}</FieldMessage>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <InputGroup className={errors.email ? "border-destructive" : undefined}>
          <InputGroupAddon>
            <MailIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            {...register("email")}
          />
        </InputGroup>
        {errors.email?.message && <FieldMessage>{errors.email.message}</FieldMessage>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup
          className={errors.password ? "border-destructive" : undefined}
        >
          <InputGroupAddon>
            <LockIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            {...register("password")}
          />
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              className="inline-flex items-center justify-center"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </InputGroupAddon>
        </InputGroup>
        {errors.password?.message && (
          <FieldMessage>{errors.password.message}</FieldMessage>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <InputGroup
          className={errors.confirmPassword ? "border-destructive" : undefined}
        >
          <InputGroupAddon>
            <LockIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="confirmPassword"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Confirm your password"
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
          ? "Creating account..."
          : "Get started"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

