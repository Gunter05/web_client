"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PASSWORD_MIN_LENGTH } from "@/modules/authentication/domain/authentication.types";

export function RegisterForm({
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
  const c = state.fieldErrors ?? {};
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="hidden" name="returnTo" value={returnTo} />
      <FormField id="name" label={t("name")} error={errors(c.name)}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={!!c.name}
        />
      </FormField>
      <FormField id="email" label={t("email")} error={errors(c.email)}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!c.email}
        />
      </FormField>
      <FormField
        id="password"
        label={t("password")}
        error={errors(c.password)}
        help={t("passwordHelp", { min: PASSWORD_MIN_LENGTH })}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!c.password}
        />
      </FormField>
      <Button type="submit" size="lg" disabled={enCours} className="w-full">
        {t("register")}
      </Button>
    </form>
  );
}
