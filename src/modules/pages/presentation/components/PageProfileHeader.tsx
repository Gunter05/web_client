import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Badge } from "@/shared/ui/badge";
import { useTranslations } from "next-intl";
import type { Page } from "@/modules/pages/domain/page.types";

/** En-tête de page publique, façon profil Instagram (avatar, compteurs, bio). */
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
    <header className="flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-0">
      <div className="flex items-center gap-6 sm:block">
        <ProfileAvatar name={page.name} photo={page.photoUrl} size="xl" ring />
        <div className="grid gap-1 sm:hidden">
          <h1 className="text-xl font-semibold">{page.name}</h1>
          <Badge variant="secondary" className="w-fit">
            {t(`types.${page.type}`)}
          </Badge>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          <h1 className="text-xl font-semibold">{page.name}</h1>
          <Badge variant="secondary">{t(`types.${page.type}`)}</Badge>
        </div>
        <p className="flex gap-6 text-sm">
          <span className="font-semibold">
            {t("public.events", { n: eventCount })}
          </span>
          <span className="text-muted-foreground">
            {t("public.members", { n: memberCount })}
          </span>
        </p>
        <p className="max-w-prose text-sm whitespace-pre-line">
          {page.description}
        </p>
      </div>
    </header>
  );
}
