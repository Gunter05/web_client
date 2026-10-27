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
  /**
   * Origine du stockage des photos (ADR 0014 du backend), autorisée par la
   * politique de sécurité : le navigateur y envoie les photos et y lit les
   * images. Ex. http://localhost:8333 (SeaweedFS), l'URL du projet Supabase ou
   * le domaine R2. Vide : stockage sur disque, tout passe par l'API.
   */
  MEDIAS_STORAGE_ORIGINS: z.string().default(""),
  /**
   * Client OAuth « Application Web » de Google Cloud (ADR 0019 du backend).
   * Le secret ne quitte jamais le serveur. Si l'un manque, le bouton
   * « Continuer avec Google » n'est pas affiché.
   */
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  /**
   * Scénario de campagnes de démonstration (bds, mix, partner, announcement)
   * tant que l'API ne sert pas /campaigns/active. Vide : campagnes de l'API.
   */
  CAMPAIGNS_DEMO: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["bds", "mix", "partner", "announcement"]).optional(),
  ),
});

export const clientSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.url(),
  /**
   * Projet Firebase (notifications push, ADR 0017). Valeurs publiques, données
   * par la console Firebase (configuration de l'application Web, clé VAPID des
   * certificats Web Push). Si l'une manque, les push sont désactivés.
   */
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.string().default(""),
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
