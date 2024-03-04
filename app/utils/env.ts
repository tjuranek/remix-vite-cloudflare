import { z } from "zod";

const envSchema = z.object({
  COOKIE_SECRET: z.string(),
  WORKOS_API_KEY: z.string(),
  WORKOS_CLIENT_ID: z.string(),
  WORKOS_REDIRECT_URI: z.string(),
});

export const env = envSchema.parse(process.env);
