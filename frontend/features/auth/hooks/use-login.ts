"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import { type LoginInput } from "@/features/auth/schemas/auth.schema";

export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginInput) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result) {
        throw new Error("Could not sign in. Please try again.");
      }

      if (result.error) {
        throw new Error("Invalid email or password.");
      }

      return result;
    },
  });
}

