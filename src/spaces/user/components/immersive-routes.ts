/**
 * Pages affichées en plein écran sur téléphone, sans en-tête ni barre du bas :
 * la fiche d'un événement et la création d'un événement s'ouvrent comme des
 * pages à part, avec leur propre bouton retour (et le retour natif du
 * téléphone).
 */
const IMMERSIVE = [/^\/e\/[^/]+$/, /^\/events\/new$/];

export function isImmersive(pathname: string): boolean {
  return IMMERSIVE.some((route) => route.test(pathname));
}
