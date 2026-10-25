import { Suspense, type ReactNode } from "react";
import { AUTH_TITLE_ID } from "@/modules/authentication";
import { RouteModal } from "@/shared/components/RouteModal";
import { Skeleton } from "@/shared/ui/skeleton";

/** Écran d'authentification ouvert par-dessus la page en cours (route interceptée). */
export function AuthModal({
  path,
  children,
}: {
  /** Adresse de l'écran (« /login »…). */
  path: string;
  children: ReactNode;
}) {
  return (
    // Pas de squelette : la modal s'ouvre une fois le contenu prêt, sans
    // changer de taille sous les yeux.
    <Suspense fallback={null}>
      <RouteModal path={path} labelledBy={AUTH_TITLE_ID}>
        {children}
      </RouteModal>
    </Suspense>
  );
}

/** Écran d'authentification en page, quand son adresse est ouverte directement. */
export function AuthPage({ children }: { children: ReactNode }) {
  return (
    // Sur téléphone, l'écran occupe toute la hauteur : le pied (« Pas encore de
    // compte ? ») est en bas de l'écran.
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col *:flex-1 md:*:flex-none">
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
