"use client";

import { useReportWebVitals } from "next/web-vitals";

// Affiche les Web Vitals (vitesse de chargement, stabilité de la page…)
// dans la console en développement. En production, rien n'est envoyé pour
// l'instant : voir la section « Reporté » du README.
export function WebVitals() {
  useReportWebVitals((mesure) => {
    if (process.env.NODE_ENV === "development") {
      console.info(`[web-vitals] ${mesure.name}`, Math.round(mesure.value));
    }
  });
  return null;
}
