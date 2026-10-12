import { z } from "zod";

export const serverSchema = z.object({
  API_URL: z.url().optional(),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export function valider<T extends z.ZodType>(
  schema: T,
  valeurs: unknown,
): z.infer<T> {
  const resultat = schema.safeParse(valeurs);
  if (!resultat.success) {
    throw new Error(
      `Variables d'environnement invalides: \n${z.prettifyError(resultat.error)}`,
    );
  }
  return resultat.data;
}
