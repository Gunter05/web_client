import { clientSchema, valider } from "./schema";

export const clientEnv = valider(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
