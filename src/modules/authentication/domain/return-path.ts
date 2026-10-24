/** N'accepte qu'un chemin interne, pour éviter les redirections ouvertes. */
export function internalPath(returnTo: string | null | undefined): string {
  return returnTo?.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/";
}
