import { type ReactNode, Suspense } from "react";
import { VisitTracker } from "@/modules/audience";
import {
  trackInstallAction,
  trackVisitAction,
} from "@/modules/audience/application/audience.actions";
import { Logo } from "@/shared/components/layout/Logo";
import { Skeleton } from "@/shared/ui/skeleton";
import { BottomNav } from "@/spaces/user/components/BottomNav";
import { HideOnImmersive } from "@/spaces/user/components/HideOnImmersive";
import { EmailVerificationForAccount } from "@/spaces/user/components/EmailVerificationForAccount";
import { MobileHeader } from "@/spaces/user/components/MobileHeader";
import { PushSyncForAccount } from "@/spaces/user/components/PushSyncForAccount";
import { Sidebar } from "@/spaces/user/components/Sidebar";
import { SidebarFrame } from "@/spaces/user/components/SidebarFrame";

/**
 * Mise en page de l'application utilisateurs, inspirée d'Instagram : barre
 * latérale sur ordinateur, en-tête et barre de navigation basse sur
 * téléphone, masqués sur les pages plein écran (fiche d'un événement). Le
 * cadre est statique ; ce qui dépend de la session arrive derrière des
 * Suspense (Cache Components, ADR 0004).
 */
export function UserLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarFrame
      logo={<Logo />}
      compactLogo={<Logo compact />}
      sidebar={
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <Sidebar />
        </Suspense>
      }
    >
      <HideOnImmersive>
        <MobileHeader />
      </HideOnImmersive>
      <Suspense>
        <EmailVerificationForAccount />
      </Suspense>
      <main className="pb-20 md:pb-10">{children}</main>
      <HideOnImmersive>
        <Suspense>
          <BottomNav />
        </Suspense>
      </HideOnImmersive>
      <Suspense>
        <PushSyncForAccount />
      </Suspense>
      {/* Activité des visiteurs, sans compte : une visite par jour, application installée */}
      <VisitTracker visit={trackVisitAction} install={trackInstallAction} />
    </SidebarFrame>
  );
}
