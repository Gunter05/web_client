import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";

/** Libellé + contrôle + aide + erreur affichée sous le champ (US-11). */
export function Champ({
  id,
  libelle,
  erreur,
  aide,
  children,
  className,
}: {
  id: string;
  libelle: ReactNode;
  erreur?: string | null;
  aide?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{libelle}</Label>
      {children}
      {aide && !erreur && (
        <p className="text-xs text-muted-foreground">{aide}</p>
      )}
      {erreur && (
        <p
          id={`${id}-erreur`}
          role="alert"
          className="text-sm text-destructive"
        >
          {erreur}
        </p>
      )}
    </div>
  );
}
