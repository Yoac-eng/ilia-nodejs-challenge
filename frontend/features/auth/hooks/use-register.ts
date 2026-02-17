"use client";

import { useMutation } from "@tanstack/react-query";

import { type RegisterInput } from "@/features/auth/schemas/auth.schema";
import { apiRequest } from "@/lib/api-client";

type RegisterPayload = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

function toRegisterPayload(values: RegisterInput): RegisterPayload {
  return {
    name: values.name,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
  };
}

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterInput) =>
      apiRequest({
        service: "users",
        path: "/register",
        method: "POST",
        body: toRegisterPayload(values),
      }),
  });
}

