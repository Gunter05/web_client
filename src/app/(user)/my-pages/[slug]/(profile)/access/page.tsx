import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AccessManager } from "@/modules/pages";
import {
  grantAccessAction,
  revokeAccessAction,
  searchUsersAction,
} from "@/modules/pages/application/pages.actions";
import { getMembers, getMyPage } from "@/modules/pages/server";

/** Onglet « Accès », réservé au propriétaire (US-06). */
async function MyPageAccess({ params }: PageProps<"/my-pages/[slug]/access">) {
  const { slug } = await params;
  const page = await getMyPage(slug);
  if (!page) return null;
  const t = await getTranslations();
  return (
    <div className="grid gap-4 px-4 pb-4 sm:px-0">
      {page.role !== "owner" ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("errors.accessDenied")}
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t("pages.access.intro")}
          </p>
          <AccessManager
            members={await getMembers(page.id)}
            search={searchUsersAction.bind(null, page.id)}
            grant={grantAccessAction.bind(null, page.id)}
            remove={revokeAccessAction.bind(null, page.id)}
          />
        </>
      )}
    </div>
  );
}

/** Les paramètres sont lus derrière ce Suspense (Cache Components). */
export default function Page(props: PageProps<"/my-pages/[slug]/access">) {
  return (
    <Suspense>
      <MyPageAccess {...props} />
    </Suspense>
  );
}
