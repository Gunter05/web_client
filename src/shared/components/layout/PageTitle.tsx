import { ArrowLeftIcon } from "@/shared/components/icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export function PageTitle({
  title,
  returnTo,
  subtitle,
  action,
}: {
  title: string;
  returnTo?: string;
  subtitle?: string;
  /** Bouton à droite du titre (menu…). */
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-2">
      {returnTo && (
        <Link
          href={returnTo}
          aria-label="←"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "-ml-2 shrink-0",
          )}
        >
          <ArrowLeftIcon />
        </Link>
      )}
      <div className="grid min-w-0 flex-1 gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
