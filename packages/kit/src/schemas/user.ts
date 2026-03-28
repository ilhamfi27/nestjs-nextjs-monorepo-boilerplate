import { z } from 'zod';
import { UuidSchema, DateSchema } from './api';

export const UserSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1),
  email: z.email(),
  createdAt: DateSchema,
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
