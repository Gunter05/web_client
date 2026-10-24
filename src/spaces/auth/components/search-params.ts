export type AuthSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

/** Page où revenir après la connexion : un chemin interne, sinon l'accueil. */
export function returnPath(returnTo: unknown): string {
  return typeof returnTo === "string" && returnTo.startsWith("/")
    ? returnTo
    : "/";
}
