import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/** « [n] vues », affiché aux seuls membres de la page organisatrice (US-39). */
export function ViewCount({ n }: { n: number }) {
  const t = useTranslations("events");
  return (
    <p className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
      <EyeIcon className="size-4 text-muted-foreground" />
      <span className="font-semibold">{t("views", { n })}</span>
      <span className="text-xs text-muted-foreground">· {t("viewsHelp")}</span>
    </p>
  );
}
