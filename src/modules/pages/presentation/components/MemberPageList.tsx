import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import type { MemberPage } from "@/modules/pages/domain/page.types";

/**
 * Liste des pages dont le compte est membre, avec son rôle. Sert à « Mes
 * pages » et au choix de la page avant de créer un événement : seul le lien
 * de chaque ligne change.
 */
export function MemberPageList({
  pages,
  link,
}: {
  pages: MemberPage[];
  link: (page: MemberPage) => string;
}) {
  const t = useTranslations("pages.roles");
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {pages.map((page) => (
        <li key={page.id}>
          <Link
            href={link(page)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
          >
            <ProfileAvatar name={page.name} photo={page.photoUrl} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{page.name}</span>
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
