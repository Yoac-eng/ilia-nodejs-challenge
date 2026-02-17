"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogin } from "@/features/auth/hooks/use-login";
import { type LoginInput, loginSchema } from "@/features/auth/schemas/auth.schema";
import { Button } from "@/ui/button";
import { Field, FieldLabel, FieldMessage } from "@/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";

export function LoginForm() {
  const router = useRouter();
  const { setToken } = useAuth();
  const loginMutation = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const data = await loginMutation.mutateAsync(values);

    setToken(data.token);
    router.push("/");
  });

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      {loginMutation.error instanceof Error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {loginMutation.error.message}
        </div>
      )}

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
            placeholder="Enter your password"
            autoComplete="current-password"
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

      <Button
        type="submit"
        className="w-full my-4"
        disabled={isSubmitting || loginMutation.isPending}
      >
        {isSubmitting || loginMutation.isPending ? "Signing in..." : "Get started"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Dont have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

