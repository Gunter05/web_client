"use client";

import { useReportWebVitals } from "next/web-vitals";

// Affiche les Web Vitals (vitesse de chargement, stabilité de la page…)
// dans la console. Rendu en développement seulement (layout racine) : en
// production, rien n'est envoyé pour l'instant, voir la section « Reporté »
// du README. Sans `clientEnv`, Zod ne part pas dans le code du navigateur.
export function WebVitals() {
  useReportWebVitals((metric) => {
    console.info(`[web-vitals] ${metric.name}`, Math.round(metric.value));
  });
  return null;
}
