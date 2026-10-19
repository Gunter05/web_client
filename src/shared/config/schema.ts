import { z } from "zod";

export const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  /** API Le Contineng (back), appelée uniquement côté serveur (ADR 0003). */
  API_URL: z.url().default("http://localhost:8080"),
  /**
   * Fuseau de l'aperçu WhatsApp (US-36), calculé côté serveur sans connaître
   * l'appareil du lecteur. L'interface affiche toujours l'heure de l'appareil (D7).
   */
  FUSEAU_APERCU: z.string().default("Africa/Douala"),
});

export const clientSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export function validate<T extends z.ZodType>(
  schema: T,
  values: unknown,
): z.infer<T> {
  const result = schema.safeParse(values);
  if (!result.success) {
    throw new Error(
      `Variables d'environnement invalides: \n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
