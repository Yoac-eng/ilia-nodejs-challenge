"use client";

import { useMutation } from "@tanstack/react-query";

import { type LoginInput } from "@/features/auth/schemas/auth.schema";
import { apiRequest } from "@/lib/api-client";

type LoginResponse = {
  token: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginInput) =>
      apiRequest<LoginResponse>({
        service: "users",
        path: "/login",
        method: "POST",
        body: values,
      }),
  });
}

