import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";

export function EnTetePage({
  titre,
  retour,
  sousTitre,
}: {
  titre: string;
  retour?: string;
  sousTitre?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-2">
      {retour && (
        <Link
          href={retour}
          aria-label="←"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "-ml-2 shrink-0",
          )}
        >
          <ArrowLeftIcon />
        </Link>
      )}
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{titre}</h1>
        {sousTitre && (
          <p className="text-sm text-muted-foreground">{sousTitre}</p>
        )}
      </div>
    </div>
  );
}
