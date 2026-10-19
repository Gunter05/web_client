"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { IllustratedDialog } from "@/shared/components/IllustratedDialog";
import { Button } from "@/shared/ui/button";

/**
 * Première étape de la création d'un événement : le choix de la page, dans
 * un modal illustré ouvert d'office. Le fermer (ou « Plus tard ») ramène à
 * la page précédente, ou à l'accueil si on est arrivé directement.
 */
export function ChoosePageDialog({
  title,
  description,
  children,
  primaryAction,
}: {
  title: string;
  description: string;
  children: ReactNode;
  /** Action principale (ex. demander une page quand on n'en a aucune). */
  primaryAction?: ReactNode;
}) {
  const t = useTranslations("events");
  const router = useRouter();

  function close() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <IllustratedDialog
      onOpenChange={(open) => !open && close()}
      illustration={<PublishIllustration />}
      title={title}
      description={description}
      actions={
        <>
          <Button variant="secondary" size="lg" onClick={close}>
            {t("later")}
          </Button>
          {primaryAction}
        </>
      }
    >
      {children}
    </IllustratedDialog>
  );
}

/**
 * Illustration propre à l'application : une affiche d'événement (tuile de
 * date, lignes de texte) tenue par une page, un badge de validation et
 * quelques éclats. Traits à la couleur du texte, pour le thème clair et sombre.
 */
function PublishIllustration() {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Affiche */}
      <rect
        x="52"
        y="10"
        width="76"
        height="100"
        rx="12"
        className="fill-muted"
      />
      {/* Tuile de date */}
      <rect
        x="64"
        y="22"
        width="26"
        height="28"
        rx="5"
        className="fill-background"
      />
      <path d="M64 31h26" />
      <path d="M71 18v8M83 18v8" />
      <path d="M73 41h8" />
      {/* Lignes de texte */}
      <path d="M98 28h18M98 37h12M64 64h52M64 74h40M64 84h46" />
      {/* Drapeau de la page */}
      <path d="M30 104V66" />
      <path d="M30 68h22l-5 8 5 8H30" className="fill-background" />
      {/* Badge de validation */}
      <circle cx="134" cy="92" r="15" className="fill-foreground" />
      <path d="M127 92l5 5 9-10" className="stroke-background" />
      {/* Éclats */}
      <path d="M150 22v10M145 27h10" />
      <path d="M22 30l6 6M28 30l-6 6" />
      <circle cx="160" cy="52" r="3" />
    </svg>
  );
}
