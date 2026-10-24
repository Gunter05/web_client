/**
 * Visite du jour : clé mémorisée dans le navigateur pour n'envoyer qu'une
 * visite par jour (UTC) et par mode. Passer du navigateur à l'application
 * installée le même jour change la clé : l'usage de l'application est compté.
 */
export function visitKey(now: Date, installedApp: boolean): string {
  return `${now.toISOString().slice(0, 10)}:${installedApp ? "app" : "web"}`;
}
