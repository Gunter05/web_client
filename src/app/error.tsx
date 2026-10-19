"use client";

import { Button } from "@/shared/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p>Réessaie dans un instant. Si le problème continue, contacte-nous.</p>
      {error.digest ? (
        <p className="text-sm text-muted-foreground">
          Référence : <code>{error.digest}</code>
        </p>
      ) : null}
      <Button onClick={() => retry()}>Réessayer</Button>
    </main>
  );
}
