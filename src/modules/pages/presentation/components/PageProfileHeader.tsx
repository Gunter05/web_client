import { CalendarDaysIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { BackButton } from "@/shared/components/BackButton";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import type { Page } from "@/modules/pages/domain/page.types";

/**
 * En-tête de page publique : couverture encre aux grandes formes du logo
 * (décoratives) avec le cercle de verre « Retour », puis une carte opaque qui
 * la chevauche : avatar de 96 px qui déborde en haut, nom et type, bio et
 * compteurs.
 */
export function PageProfileHeader({
  page,
  eventCount,
  memberCount,
}: {
  page: Page;
  eventCount: number;
  memberCount: number;
}) {
  const t = useTranslations("pages");
  return (
    <header className="grid">
      <div className="relative h-[214px] overflow-hidden bg-[#0a0a0a] md:rounded-card dark:md:ring-1 dark:md:ring-white/12">
        <div aria-hidden className="absolute inset-0">
          <span className="absolute -top-16 -left-12 h-44 w-72 -rotate-[18deg] rounded-[56px] bg-ct-red" />
          <span className="absolute -top-20 -right-10 size-56 rounded-full bg-ct-blue" />
          <span className="absolute -bottom-14 left-[30%] h-36 w-44 rotate-[24deg] rounded-[44px] bg-ct-orange" />
          <span className="absolute right-[12%] -bottom-12 size-32 rounded-full bg-ct-green" />
        </div>
        <BackButton className="absolute top-3 left-3" />
      </div>

      <div className="relative z-10 mx-3 -mt-14 grid gap-4 rounded-card bg-card p-5 pt-16 text-card-foreground shadow-card md:mx-8 md:p-7 md:pt-16">
        <ProfileAvatar
          name={page.name}
          photo={page.photoUrl}
          size="xl"
          className="absolute -top-12 left-5 ring-[5px] ring-card md:left-7"
        />
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-[28px] leading-tight font-bold">{page.name}</h1>
            <span className="rounded-full bg-ct-ink px-2.5 py-1 text-xs font-semibold text-background">
              {t(`types.${page.type}`)}
            </span>
          </div>
          {page.description && (
            <p className="max-w-prose text-sm whitespace-pre-line text-muted-foreground">
              {page.description}
            </p>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-3 text-sm font-semibold md:max-w-md">
          <li className="flex items-center gap-3 rounded-2xl bg-ct-blue-soft p-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-ct-blue-ink"
            >
              <CalendarDaysIcon className="size-5" />
            </span>
            {t("public.events", { n: eventCount })}
          </li>
          <li className="flex items-center gap-3 rounded-2xl bg-ct-green-soft p-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-ct-green-ink"
            >
              <UsersIcon className="size-5" />
            </span>
            {t("public.members", { n: memberCount })}
          </li>
        </ul>
      </div>
    </header>
  );
}
