import "server-only";

export function lireRecherche(
  params: Record<string, string | string[] | undefined>,
) {
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const page = Number(typeof params.page === "string" ? params.page : 1) || 1;
  return { q, page };
}
