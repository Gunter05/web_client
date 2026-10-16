import { AvatarProfil } from "@/shared/composants/avatar-profil";
import Link from "next/link";

/** Rangée de pages façon « stories » en haut du fil : accès rapide à chaque club. */
export function CarrouselPages({
  pages,
}: {
  pages: { slug: string; nom: string; photo: string | null }[];
}) {
  if (!pages.length) return null;
  return (
    <nav
      aria-label="Pages"
      className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <ul className="flex gap-4 py-1">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/p/${page.slug}`}
              className="flex w-18 flex-col items-center gap-1.5 text-center"
            >
              <AvatarProfil
                nom={page.nom}
                photo={page.photo}
                taille="lg"
                anneau
              />
              <span className="w-full truncate text-xs">{page.nom}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
