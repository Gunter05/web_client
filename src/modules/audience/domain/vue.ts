/** Une vue = un visiteur unique par événement et par jour UTC (US-39). */
export type Vue = { evenementId: string; visiteurId: string; jour: string };

/** Robots d'aperçu et moteurs de recherche : jamais comptés. */
const ROBOTS =
  /bot|crawl|spider|slurp|preview|whatsapp|facebookexternalhit|telegram|skype|discord|embedly|curl|wget|headless/i;

export function estUnRobot(userAgent: string | null): boolean {
  return !userAgent || ROBOTS.test(userAgent);
}

export function dejaVue(vues: readonly Vue[], vue: Vue): boolean {
  return vues.some(
    (v) =>
      v.evenementId === vue.evenementId &&
      v.visiteurId === vue.visiteurId &&
      v.jour === vue.jour,
  );
}
