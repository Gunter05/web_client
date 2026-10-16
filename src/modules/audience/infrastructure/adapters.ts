import "server-only";
import { cookies, headers } from "next/headers";
import { collection } from "@/shared/stockage/collection-json";
import type { DepotVues } from "../application/cas-usage";
import type { Vue } from "../domain/vue";

const vues = collection<Vue>("vues", () => []);

export const depotVuesJson: DepotVues = {
  toutes: () => vues.tous(),
  ajouter: (vue) => vues.muter((l) => [...l, vue]),
};

const COOKIE_VISITEUR = "contineng_visiteur";

/** Identifiant anonyme du visiteur ; à appeler depuis une Server Action (pose un cookie). */
export async function visiteurCourant(): Promise<string> {
  const jar = await cookies();
  const existant = jar.get(COOKIE_VISITEUR)?.value;
  if (existant) return existant;
  const id = crypto.randomUUID();
  jar.set(COOKIE_VISITEUR, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

export async function userAgentCourant(): Promise<string | null> {
  return (await headers()).get("user-agent");
}
