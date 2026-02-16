import { z } from 'zod';

export const updateUserSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'First name cannot be empty')
      .max(255, 'First name is too long')
      .optional(),
    last_name: z
      .string()
      .min(1, 'Last name cannot be empty')
      .max(255, 'Last name is too long')
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .max(254, 'Email is too long')
      .optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(255, 'Password is too long')
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for update',
  })
  .transform((data) => ({
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    password: data.password,
  }));

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
