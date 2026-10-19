import { clientSchema, valider } from "@/shared/config/schema";

export const clientEnv = valider(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
