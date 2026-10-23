import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SessionList } from "@/modules/authentication";
import {
  getCurrentAccount,
  listSessions,
} from "@/modules/authentication/server";
import {
  revokeOtherSessionsAction,
  revokeSessionAction,
} from "@/modules/authentication/application/authentication.actions";
import { PushToggle } from "@/modules/notifications";
import {
  registerPushDeviceAction,
  unregisterPushDeviceAction,
} from "@/modules/notifications/application/notifications.actions";
import { ProfileForm } from "@/modules/profiles";
import { updateProfileAction } from "@/modules/profiles/application/profiles.actions";
import { UrlToast } from "@/shared/components/UrlToast";
import { PageTitle } from "@/shared/components/layout/PageTitle";
import { ContentSkeleton } from "@/shared/components/layout/ContentSkeleton";

const pushActions = {
  register: registerPushDeviceAction,
  unregister: unregisterPushDeviceAction,
};

/**
 * Profil personnel : nom et photo, notifications push de cet appareil et
 * appareils connectés au compte.
 */
async function Profile() {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?returnTo=/profile");
  const t = await getTranslations("auth");
  const sessions = await listSessions();
  return (
    <div className="mx-auto grid max-w-xl gap-8 px-4 pt-6 md:pt-10">
      <UrlToast
        messages={{
          profileSaved: t("profileSaved"),
          emailVerified: t("emailVerified"),
        }}
      />
      <PageTitle title={t("myProfile")} subtitle={account.email} />
      <ProfileForm
        key={`${account.name}-${account.photoUrl}`}
        action={updateProfileAction}
        name={account.name}
        photo={account.photoUrl}
      />
      <PushToggle actions={pushActions} />
      <SessionList
        sessions={sessions}
        revoke={revokeSessionAction}
        revokeOthers={revokeOtherSessionsAction}
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
