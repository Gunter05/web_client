import type { Instrumentation } from "next";

// Point unique de capture des erreurs serveur. Pour brancher Sentry ou
// OpenTelemetry plus tard, c'est ici qu'on enverra l'erreur, sans toucher aux pages.
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  const digest =
    typeof err === "object" && err !== null && "digest" in err
      ? String(err.digest)
      : undefined;

  console.error(
    JSON.stringify({
      niveau: "erreur",
      message: err instanceof Error ? err.message : String(err),
      digest,
      chemin: request.path,
      methode: request.method,
      route: context.routePath,
      type: context.routeType,
    }),
  );
};
