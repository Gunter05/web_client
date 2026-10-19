"use client";

// Remplace le layout racine quand c'est lui qui plante : il doit donc fournir
// ses propres <html> et <body>, sans les styles globaux.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <title>Erreur · Le Contineng</title>
        <h1>Le site a rencontré un problème</h1>
        <p>Réessaie dans un instant.</p>
        {error.digest ? (
          <p>
            Référence : <code>{error.digest}</code>
          </p>
        ) : null}
        <button type="button" onClick={() => retry()}>
          Réessayer
        </button>
      </body>
    </html>
  );
}
