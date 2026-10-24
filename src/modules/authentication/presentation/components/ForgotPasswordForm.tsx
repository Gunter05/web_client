"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFieldsFilled } from "@/shared/hooks/useFieldsFilled";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

/** Demande d'un lien pour choisir un nouveau mot de passe. */
export function ForgotPasswordForm({ action }: { action: FormAction }) {
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
      <FormField
        id="email"
        label={t("email")}
        error={errors(state.fieldErrors?.email)}
      >
        <Input
          placeholder={t("email")}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
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
        {t("sendResetLink")}
      </Button>
    </form>
  );
}
