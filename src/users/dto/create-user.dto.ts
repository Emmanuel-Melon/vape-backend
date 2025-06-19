import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
