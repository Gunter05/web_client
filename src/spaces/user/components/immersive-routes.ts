/**
 * Pages affichées en plein écran sur téléphone, sans en-tête ni barre du bas :
 * la fiche d'un événement s'ouvre comme une page à part, avec son propre
 * bouton retour (et le retour natif du téléphone).
 */
const IMMERSIVE = [/^\/e\/[^/]+$/];

export function isImmersive(pathname: string): boolean {
  return IMMERSIVE.some((route) => route.test(pathname));
}
