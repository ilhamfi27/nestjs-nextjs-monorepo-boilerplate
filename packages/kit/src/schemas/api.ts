import { z } from 'zod';

export const UuidSchema = z.uuid();
export const DateSchema = z.coerce.date();

export const ApiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.discriminatedUnion('success', [ApiSuccessSchema(dataSchema), ApiErrorSchema]);
