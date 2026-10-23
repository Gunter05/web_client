import { EmailVerificationBanner } from "@/modules/authentication";
import { getCurrentAccount } from "@/modules/authentication/server";
import { resendVerificationAction } from "@/modules/authentication/application/authentication.actions";

/** Bandeau de confirmation d'adresse, pour une personne connectée non confirmée. */
export async function EmailVerificationForAccount() {
  const account = await getCurrentAccount();
  if (!account || account.emailVerified) return null;
  return (
    <EmailVerificationBanner
      email={account.email}
      resend={resendVerificationAction}
    />
  );
}
