import type { ReactNode } from "react";
import { RouteModalLink } from "@/shared/components/RouteModal";

/** Lien entre écrans d'authentification : reste en modal ou en page. */
export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <RouteModalLink
      href={href}
      className="font-semibold text-primary hover:underline"
    >
      {children}
    </RouteModalLink>
  );
}
