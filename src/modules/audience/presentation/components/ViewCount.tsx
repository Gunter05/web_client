import { EyeIcon } from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";

/**
 * « [n] vues », affiché aux seuls membres de la page organisatrice (US-39),
 * à la hauteur de la pastille d'actions voisine (48 px).
 */
export function ViewCount({ n, className }: { n: number; className?: string }) {
  const t = useTranslations("events");
  return (
    <p
      className={cn(
        "flex h-12 items-center gap-2 rounded-full bg-muted px-4 text-sm",
        className,
      )}
    >
      <EyeIcon className="size-4 opacity-70" />
      <span className="font-semibold">{t("views", { n })}</span>
    </p>
  );
}
