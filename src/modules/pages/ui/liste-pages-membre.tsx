import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import type { PageDuMembre } from "../domain/page";

/**
 * Liste des pages dont le compte est membre, avec son rôle. Sert à « Mes
 * pages » et au choix de la page avant de créer un événement : seul le lien
 * de chaque ligne change.
 */
export function ListePagesMembre({
  pages,
  lien,
}: {
  pages: PageDuMembre[];
  lien: (page: PageDuMembre) => string;
}) {
  const t = useTranslations("pages.roles");
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {pages.map((page) => (
        <li key={page.id}>
          <Link
            href={lien(page)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
          >
            <AvatarProfil
              nom={page.nom}
              photo={page.photo}
              taille="md"
              anneau
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{page.nom}</span>
              <span className="block truncate text-sm text-muted-foreground">
                @{page.slug} · {t(page.role)}
              </span>
            </span>
            <ChevronRightIcon className="size-5 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
