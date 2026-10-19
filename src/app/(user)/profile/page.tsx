import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/modules/auth";
import { getCurrentAccount } from "@/modules/auth/server";
import { UrlToast } from "@/shared/components/UrlToast";
import { updateProfileAction } from "@/modules/auth/application/auth.actions";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { Suspense } from "react";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

/** Profil personnel : nom et photo. */
async function Profile() {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?returnTo=/profile");
  const t = await getTranslations("auth");
  return (
    <div className="mx-auto max-w-xl px-4 pt-6 md:pt-10">
      <UrlToast messages={{ profileSaved: t("profileSaved") }} />
      <PageTitle title={t("myProfile")} subtitle={account.email} />
      <ProfileForm
        key={`${account.name}-${account.photoUrl}`}
        action={updateProfileAction}
        name={account.name}
        photo={account.photoUrl}
      />
    </div>
  );
}

/** La session est lue dans Profil, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Profile />
    </Suspense>
  );
}
