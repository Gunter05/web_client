"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFieldsFilled } from "@/shared/hooks/useFieldsFilled";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/modules/authentication/presentation/components/PasswordInput";
import { Input } from "@/shared/ui/input";

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
      <FormField id="name" label={t("name")} error={errors(c.name)}>
        <Input
          placeholder={t("name")}
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={!!c.name}
        />
      </FormField>
      <FormField id="email" label={t("email")} error={errors(c.email)}>
        <Input
          placeholder={t("email")}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!c.email}
        />
      </FormField>
      <FormField id="password" label={t("password")} error={errors(c.password)}>
        <PasswordInput
          placeholder={t("password")}
          id="password"
          name="password"
          autoComplete="new-password"
          aria-invalid={!!c.password}
        />
      </FormField>
      <Button
        type="submit"
        size="lg"
        disabled={enCours || !filled}
        className="w-full"
      >
        {t("register")}
      </Button>
    </form>
  );
}
