import { ArrowLeftIcon } from "@/shared/components/icons";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export function PageTitle({
  title,
  returnTo,
  subtitle,
}: {
  title: string;
  returnTo?: string;
  subtitle?: string;
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
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
