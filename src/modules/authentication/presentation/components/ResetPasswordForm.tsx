"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFieldsFilled } from "@/shared/hooks/useFieldsFilled";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/modules/authentication/presentation/components/PasswordInput";

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
  const { filled, onInput } = useFieldsFilled();
  return (
    <form
      action={send}
      onSubmit={onSubmit}
      onInput={onInput}
      className="grid gap-4"
      noValidate
    >
      <input type="hidden" name="token" value={token} />
      <FormField
        id="password"
        label={t("newPassword")}
        error={errors(state.fieldErrors?.password)}
      >
        <PasswordInput
          placeholder={t("newPassword")}
          id="password"
          name="password"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors?.password}
        />
      </FormField>
      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={enCours || !filled}
        className="w-full"
      >
        {t("saveNewPassword")}
      </Button>
    </form>
  );
}
