import { z } from 'zod';

export const HealthcheckResponse = z.object({
  ok: z.literal(true),
  version: z.string(),
  uptime_s: z.number(),
});
export type HealthcheckResponse = z.infer<typeof HealthcheckResponse>;

export const ApiError = z.object({
  code: z.string(),
  message: z.string(),
  status: z.number(),
});
export type ApiError = z.infer<typeof ApiError>;
