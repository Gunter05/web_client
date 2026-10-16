import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { Badge } from "@/shared/ui/badge";
import { useTranslations } from "next-intl";
import type { Page } from "../domain/page";

/** En-tête de page publique, façon profil Instagram (avatar, compteurs, bio). */
export function EntetePage({
  page,
  nbEvenements,
  nbMembres,
}: {
  page: Page;
  nbEvenements: number;
  nbMembres: number;
}) {
  const t = useTranslations("pages");
  return (
    <header className="flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-0">
      <div className="flex items-center gap-6 sm:block">
        <AvatarProfil nom={page.nom} photo={page.photo} taille="xl" anneau />
        <div className="grid gap-1 sm:hidden">
          <h1 className="text-xl font-semibold">{page.nom}</h1>
          <Badge variant="secondary" className="w-fit">
            {t(`types.${page.type}`)}
          </Badge>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          <h1 className="text-xl font-semibold">{page.nom}</h1>
          <Badge variant="secondary">{t(`types.${page.type}`)}</Badge>
        </div>
        <p className="flex gap-6 text-sm">
          <span className="font-semibold">
            {t("publique.evenements", { n: nbEvenements })}
          </span>
          <span className="text-muted-foreground">
            {t("publique.membres", { n: nbMembres })}
          </span>
        </p>
        <p className="max-w-prose text-sm whitespace-pre-line">
          {page.description}
        </p>
      </div>
    </header>
  );
}
