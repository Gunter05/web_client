"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PASSWORD_MIN_LENGTH } from "@/modules/authentication/domain/authentication.types";

/** Nouveau mot de passe, avec le secret du lien reçu par e-mail. */
export function ResetPasswordForm({
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
    <form action={send} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormField
        id="password"
        label={t("newPassword")}
        error={errors(state.fieldErrors?.password)}
        help={t("passwordHelp", { min: PASSWORD_MIN_LENGTH })}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors?.password}
        />
      </FormField>
      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("saveNewPassword")}
      </Button>
    </form>
  );
}
