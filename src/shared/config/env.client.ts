import { clientSchema, validate } from "@/shared/config/schema";

export const clientEnv = validate(clientSchema, {
  // Lecture littérale : Next.js remplace ces valeurs dans le code client.
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
