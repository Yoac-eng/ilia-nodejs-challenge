import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("A valid email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  confirmPassword: z.string().min(6, "Confirm your password."),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

