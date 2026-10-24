import { Suspense, type ReactNode } from "react";
import { AUTH_TITLE_ID } from "@/modules/authentication";
import { RouteModal } from "@/shared/components/RouteModal";
import { Skeleton } from "@/shared/ui/skeleton";

/** Écran d'authentification ouvert par-dessus la page en cours (route interceptée). */
export function AuthModal({ children }: { children: ReactNode }) {
  return (
    // Pas de squelette : la modal s'ouvre une fois le contenu prêt, sans
    // changer de taille sous les yeux.
    <Suspense fallback={null}>
      <RouteModal labelledBy={AUTH_TITLE_ID}>{children}</RouteModal>
    </Suspense>
  );
}

/** Écran d'authentification en page, quand son adresse est ouverte directement. */
export function AuthPage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="grid gap-4 p-10">
      <Skeleton className="mx-auto h-8 w-2/3" />
      <Skeleton className="h-12 rounded-full" />
      <Skeleton className="h-12 rounded-full" />
    </div>
  );
}
