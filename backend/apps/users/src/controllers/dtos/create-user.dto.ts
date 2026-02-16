import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name is too long'),
  email: z.string().email('Invalid email format').max(254, 'Email is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password is too long'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
