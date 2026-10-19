"use client";

import { useReportWebVitals } from "next/web-vitals";
import { clientEnv } from "@/shared/config/env.client";

// Affiche les Web Vitals (vitesse de chargement, stabilité de la page…)
// dans la console en développement. En production, rien n'est envoyé pour
// l'instant : voir la section « Reporté » du README.
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (clientEnv.NODE_ENV === "development") {
      console.info(`[web-vitals] ${metric.name}`, Math.round(metric.value));
    }
  });
  return null;
}
