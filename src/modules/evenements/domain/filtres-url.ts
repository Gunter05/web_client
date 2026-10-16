import {
  CATEGORIES,
  type Categorie,
  FILTRES_PAR_DEFAUT,
  PERIODES,
  type Periode,
} from "./evenement";

/**
 * Filtres repris dans l'adresse (US-17) pour qu'un lien filtré se partage :
 * ?categorie=soiree,culture&periode=passe&page=bde,club-foot
 * Les pages sont désignées par leur slug, plus lisible dans un lien.
 */
export type FiltresUrl = {
  categories: Categorie[];
  periodes: Periode[];
  pages: string[];
};

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function valeurs(params: Params, cle: string): string[] {
  const brut =
    params instanceof URLSearchParams ? params.get(cle) : params[cle];
  const texte = Array.isArray(brut) ? brut.join(",") : (brut ?? "");
  return texte
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function lireFiltresUrl(params: Params): FiltresUrl {
  const periodes = valeurs(params, "periode").filter((p): p is Periode =>
    (PERIODES as readonly string[]).includes(p),
  );
  return {
    categories: valeurs(params, "categorie").filter((c): c is Categorie =>
      (CATEGORIES as readonly string[]).includes(c),
    ),
    periodes: periodes.length ? periodes : [...FILTRES_PAR_DEFAUT.periodes],
    pages: valeurs(params, "page"),
  };
}

export function estParDefaut(f: FiltresUrl): boolean {
  const periodes = [...f.periodes].sort().join();
  return (
    !f.categories.length &&
    !f.pages.length &&
    periodes === [...FILTRES_PAR_DEFAUT.periodes].sort().join()
  );
}

export function ecrireFiltresUrl(f: FiltresUrl): string {
  const params = new URLSearchParams();
  if (f.categories.length) params.set("categorie", f.categories.join(","));
  if (f.periodes.length && !estParDefaut({ ...f, categories: [], pages: [] }))
    params.set("periode", f.periodes.join(","));
  if (f.pages.length) params.set("page", f.pages.join(","));
  return params.toString().replaceAll("%2C", ",");
}
