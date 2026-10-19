import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";

/** Libellé + contrôle + aide + erreur affichée sous le champ (US-11). */
export function FormField({
  id,
  label,
  error,
  help,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  error?: string | null;
  help?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {help && !error && (
        <p className="text-xs text-muted-foreground">{help}</p>
      )}
      {error && (
        <p
          id={`${id}-erreur`}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
