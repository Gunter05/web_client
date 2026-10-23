/**
 * Notifications push (ADR 0017) : configuration du projet Firebase et
 * vocabulaire partagé par le navigateur et le serveur.
 */
export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
};

/** Adresse du service worker exigée par Firebase Cloud Messaging. */
export const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

/** Identifiant d'installation Firebase (FID) ou ancien jeton d'enregistrement. */
export const INSTALLATION_ID = /^[A-Za-z0-9_:-]{10,4096}$/;

/**
 * Configuration complète, ou `null` si une valeur manque : les push sont
 * alors désactivés sans gêner le reste de l'application.
 */
export function firebaseWebConfig(
  values: FirebaseWebConfig & { vapidKey: string },
): { config: FirebaseWebConfig; vapidKey: string } | null {
  const { vapidKey, ...config } = values;
  if (!vapidKey || Object.values(config).some((v) => !v)) return null;
  return { config, vapidKey };
}

/** Script du service worker : affiche les push reçus quand le site est fermé. */
export function serviceWorkerScript(
  config: FirebaseWebConfig,
  sdkVersion: string,
): string {
  const sdk = `https://www.gstatic.com/firebasejs/${sdkVersion}`;
  return `// Service worker de Firebase Cloud Messaging (ADR 0017), généré par le site.
// Les notifications envoyées par l'API contiennent un titre, un texte et le lien
// ouvert au clic (fcm_options.link) : le SDK les affiche lui-même.
importScripts(${JSON.stringify(`${sdk}/firebase-app-compat.js`)});
importScripts(${JSON.stringify(`${sdk}/firebase-messaging-compat.js`)});
firebase.initializeApp(${JSON.stringify(config)});
firebase.messaging();
`;
}
