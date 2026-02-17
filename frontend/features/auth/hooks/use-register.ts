"use client";

import { useMutation } from "@tanstack/react-query";

import { type RegisterInput } from "@/features/auth/schemas/auth.schema";
import { apiRequest } from "@/lib/api-client";

type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

function toRegisterPayload(values: RegisterInput): RegisterPayload {
  return {
    first_name: values.name,
    last_name: values.lastName,
    email: values.email,
    password: values.password,
  };
}

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterInput) =>
      apiRequest({
        service: "users",
        path: "/users",
        method: "POST",
        body: toRegisterPayload(values),
      }),
  });
}

