import type { ReactNode } from "react";
import { FIELD_CLASS } from "@/shared/components/FormField";
import { Logo } from "@/shared/components/layout/Logo";
import { cn } from "@/shared/lib/utils";

/** Champs en capsules sombres et opaques. */
export const AUTH_FIELD_CLASS = cn(FIELD_CLASS, "rounded-full");

/** Carte sombre opaque (#15171B, bordure #2A2E35) : la zone est toujours sombre. */
const DARK_CARD = "rounded-[28px] border border-border bg-card shadow-pop";

export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-sm gap-3 px-4 py-8">
      <div className={`grid gap-6 p-7 ${DARK_CARD}`}>
        <div className="grid justify-items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      <p className={`p-4 text-center text-sm ${DARK_CARD}`}>{footer}</p>
    </div>
  );
}
