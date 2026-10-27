"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { RouteModalLink } from "@/shared/components/RouteModal";
import { useFieldsFilled } from "@/shared/hooks/useFieldsFilled";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/modules/authentication/presentation/components/PasswordInput";
import { Input } from "@/shared/ui/input";

export function LoginForm({
  action,
  returnTo = "/",
}: {
  action: FormAction;
  returnTo?: string;
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
      <input type="hidden" name="returnTo" value={returnTo} />
      <FormField id="email" label={t("email")}>
        <Input
          placeholder={t("email")}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
        />
      </FormField>
      <FormField id="password" label={t("password")}>
        <PasswordInput
          placeholder={t("password")}
          id="password"
          name="password"
          autoComplete="current-password"
        />
      </FormField>
      <RouteModalLink
        href="/forgot-password"
        className="-mt-2 justify-self-end text-sm text-muted-foreground hover:text-foreground"
      >
        {t("forgotPassword")}
      </RouteModalLink>
      {state.error && (
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
        {t("login")}
      </Button>
    </form>
  );
}
