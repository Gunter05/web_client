"use client";

import { EnvelopeSimpleIcon } from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useErrorMessages } from "@/shared/i18n/errors";
import { Button } from "@/shared/ui/button";

/**
 * Bandeau tant que l'adresse n'est pas confirmée : demander une page, publier
 * et recevoir des notifications push l'exigent (ADR 0017 du backend).
 */
export function EmailVerificationBanner({
  email,
  resend,
}: {
  email: string;
  resend: () => Promise<string | undefined>;
}) {
  const t = useTranslations("auth");
  const errors = useErrorMessages();
  const [result, setResult] = useState<"sent" | string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div
      role="status"
      className="mx-4 mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm md:mx-auto md:max-w-3xl"
    >
      <EnvelopeSimpleIcon className="size-5 shrink-0 text-amber-600" />
      <p className="min-w-0 flex-1">
        {t("verifyEmailBanner", { email })}
        {result && (
          <span className="block text-muted-foreground">
            {result === "sent" ? t("verificationSent") : errors(result)}
          </span>
        )}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={pending || result === "sent"}
        onClick={() => start(async () => setResult((await resend()) ?? "sent"))}
      >
        {t("resendVerification")}
      </Button>
    </div>
  );
}
