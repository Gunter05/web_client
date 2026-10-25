import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { logoutAction } from "@/modules/authentication/application/authentication.actions";
import { getCurrentAccount } from "@/modules/authentication/server";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";
import { MoreSections } from "@/spaces/user";

/**
 * « Plus » en page, ouverte depuis le bouton menu du profil sur téléphone :
 * le même contenu que le tiroir « Plus » de la barre latérale.
 */
async function More() {
  const t = await getTranslations();
  const account = await getCurrentAccount();
  return (
    <div className="mx-auto max-w-xl pt-6 md:pt-10">
      <div className="px-4">
        <PageTitle
          title={t("nav.more")}
          returnTo={account ? "/profile" : "/"}
        />
      </div>
      <MoreSections
        signedIn={!!account}
        isAdmin={account?.isAdmin ?? false}
        logout={logoutAction}
      />
    </div>
  );
}

/** La session est lue dans More, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <More />
    </Suspense>
  );
}
