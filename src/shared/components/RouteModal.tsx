"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent } from "@/shared/ui/dialog";

/**
 * Relais entre deux modals de route (connexion → inscription) : le suivant ne
 * rejoue pas l'entrée du cadre et du fond, seul son contenu apparaît en
 * fondu ; le cadre semble rester en place. Signalé par le lien cliqué.
 */
let relayRequestedAt = -Infinity;
const RELAY_MS = 5000;
/** Durée de l'animation de sortie (data-closed:duration-200), avec une marge. */
const CLOSE_MS = 400;

function relayRouteModal() {
  relayRequestedAt = performance.now();
}

/** Vrai dans le contenu d'un modal de route. */
const InRouteModal = createContext(false);

/**
 * Lien vers un écran qui existe en modal et en page : on reste dans le mode
 * de départ. Dans un modal, le suivant le remplace (fermer ramène à la page
 * d'origine) et prend le relais sans rejouer son entrée ; sur une page, la
 * page suivante se charge entière, sans être interceptée en modal.
 */
export function RouteModalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (!useContext(InRouteModal))
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  return (
    <Link
      href={href}
      replace
      scroll={false}
      onClick={relayRouteModal}
      className={className}
    >
      {children}
    </Link>
  );
}

/**
 * Modal d'une route interceptée : ouvert tant que la route est affichée, il se ferme (en
 * douceur) en revenant à la page d'où il a été ouvert. Centré sur grand écran, plein écran sur
 * mobile.
 */
export function RouteModal({
  labelledBy,
  children,
}: {
  /** Identifiant du titre du contenu (nom accessible du modal). */
  labelledBy?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  // Ouvert seulement pendant que la route est affichée : Next.js garde les
  // routes quittées dans une <Activity> masquée, qui démonte les effets mais
  // pas le portail du modal. La fermeture est reportée d'un instant : un
  // démontage suivi d'un remontage immédiat (mode strict de React en
  // développement) ne fait pas clignoter le modal.
  const [open, setOpen] = useState(true);
  const closing = useRef<number>(undefined);
  const closedByUser = useRef(false);
  function goBack() {
    if (!closedByUser.current) return;
    closedByUser.current = false;
    router.back();
  }
  const [relay] = useState(
    () => performance.now() - relayRequestedAt < RELAY_MS,
  );
  useEffect(() => {
    window.clearTimeout(closing.current);
    closedByUser.current = false;
    relayRequestedAt = -Infinity;
    // Rouvert quand la route redevient visible (retour, avance)
    queueMicrotask(() => setOpen(true));
    return () => {
      closing.current = window.setTimeout(() => setOpen(false));
    };
  }, []);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) return;
        // Fermé par la personne (✕, Échap, clic à côté) : l'animation de
        // sortie joue d'abord, la page d'origine revient ensuite.
        closedByUser.current = true;
        setOpen(false);
        // Au plus tard après l'animation, même si sa fin n'est pas signalée
        // (onglet en arrière-plan…)
        window.setTimeout(goBack, CLOSE_MS);
      }}
      onOpenChangeComplete={(isOpen) => !isOpen && goBack()}
    >
      <DialogContent
        aria-labelledby={labelledBy}
        data-relay={relay ? "" : undefined}
        className={cn(
          "inset-0 block h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none p-0 ring-0 duration-300 ease-(--ease-soft) sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:ring-1 data-open:zoom-in-100 data-open:slide-in-from-bottom-4 sm:data-open:zoom-in-95 sm:data-open:slide-in-from-bottom-2 data-closed:duration-200 data-closed:zoom-out-100 data-closed:slide-out-to-bottom-4 sm:data-closed:zoom-out-95 sm:data-closed:slide-out-to-bottom-2 [&>[data-slot=dialog-close]]:top-4 [&>[data-slot=dialog-close]]:right-4 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-muted",
          relay && "data-open:animate-none",
        )}
      >
        {/* Fondu seul : une montée déborderait du cadre et ferait apparaître sa
          barre de défilement le temps de l'animation. */}
        <div
          className={cn(
            relay &&
              "motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-(--ease-soft) motion-safe:fade-in-0",
          )}
        >
          <InRouteModal value>{children}</InRouteModal>
        </div>
      </DialogContent>
    </Dialog>
  );
}
