import { contient, type PageDeResultats, paginer } from "../domain/pagination";

/** Projections en lecture seule fournies par les autres modules. */
export type SourcesSupervision = {
  comptes(): { id: string; nom: string; email: string; creeLe: string }[];
  pages(): { id: string; slug: string; nom: string; creeLe: string }[];
  membres(): {
    pageId: string;
    compteId: string;
    role: string;
    ajouteLe: string;
  }[];
  evenements(): {
    id: string;
    nom: string;
    pageId: string;
    debut: string;
    statut: string;
    creeLe: string;
  }[];
};

const recents = <T extends { creeLe: string }>(l: T[]) =>
  [...l].sort((a, b) => b.creeLe.localeCompare(a.creeLe));

export function listerComptes(
  s: SourcesSupervision,
  recherche: string,
  page: number,
) {
  return paginer(
    recents(
      s
        .comptes()
        .filter(
          (c) =>
            !recherche ||
            contient(c.nom, recherche) ||
            contient(c.email, recherche),
        ),
    ),
    page,
  );
}

export type LignePage = {
  id: string;
  slug: string;
  nom: string;
  creeLe: string;
  proprietaire: string;
  nbEvenements: number;
  nbMembres: number;
};

export function listerPages(
  s: SourcesSupervision,
  recherche: string,
  page: number,
): PageDeResultats<LignePage> {
  const noms = new Map(s.comptes().map((c) => [c.id, c.nom]));
  const membres = s.membres();
  const evenements = s.evenements();
  const lignes = recents(
    s.pages().filter((p) => !recherche || contient(p.nom, recherche)),
  ).map((p) => {
    const siens = membres.filter((m) => m.pageId === p.id);
    const proprietaire = siens.find((m) => m.role === "proprietaire");
    return {
      ...p,
      proprietaire: proprietaire
        ? (noms.get(proprietaire.compteId) ?? "—")
        : "—",
      nbEvenements: evenements.filter((e) => e.pageId === p.id).length,
      nbMembres: siens.length,
    };
  });
  return paginer(lignes, page);
}

export function listerEvenements(
  s: SourcesSupervision,
  recherche: string,
  page: number,
) {
  const noms = new Map(s.pages().map((p) => [p.id, p.nom]));
  return paginer(
    recents(
      s.evenements().filter((e) => !recherche || contient(e.nom, recherche)),
    ).map((e) => ({ ...e, page: noms.get(e.pageId) ?? "—" })),
    page,
  );
}
