"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
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
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="hidden" name="returnTo" value={returnTo} />
      <FormField id="email" label={t("email")}>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </FormField>
      <FormField id="password" label={t("password")}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
      </FormField>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("login")}
      </Button>
    </form>
  );
}
