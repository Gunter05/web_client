"use client";

import { useTranslations } from "next-intl";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";

/**
 * Confirmation de l'adresse par un bouton : ouvrir le lien ne suffit pas, car
 * certaines messageries ouvrent les liens pour les analyser.
 */
export function VerifyEmailForm({
  action,
  token,
}: {
  action: FormAction;
  token: string;
}) {
  const t = useTranslations("auth");
  const errors = useErrorMessages();
  const {
    state,
    onSubmit,
    enCours,
    action: send,
  } = useFormAction<FormState>(action, {});
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="token" value={token} />
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("confirmEmail")}
      </Button>
    </form>
  );
}
