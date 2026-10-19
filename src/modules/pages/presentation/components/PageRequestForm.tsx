"use client";

import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { ORGANIZATION_TYPES } from "@/modules/pages/domain/page.types";

/** Formulaire « Créer une page » (US-03). */
export function PageRequestForm({ action }: { action: FormAction }) {
  const t = useTranslations();
  const errors = useErrorMessages();
  const {
    state,
    onSubmit,
    enCours,
    action: send,
  } = useFormAction<FormState>(action, {});
  const c = state.fieldErrors ?? {};
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-5" noValidate>
      <FormField
        id="name"
        label={t("pages.request.name")}
        error={errors(c.name)}
      >
        <Input id="name" name="name" maxLength={60} aria-invalid={!!c.name} />
      </FormField>
      <FormField
        id="type"
        label={t("pages.request.type")}
        error={errors(c.type)}
      >
        <select
          id="type"
          name="type"
          defaultValue=""
          aria-invalid={!!c.type}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        >
          <option value="" disabled>
            {t("pages.request.chooseType")}
          </option>
          {ORGANIZATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`pages.types.${type}`)}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        id="description"
        label={t("pages.request.description")}
        error={errors(c.description)}
      >
        <Textarea
          id="description"
          name="description"
          maxLength={500}
          rows={3}
          aria-invalid={!!c.description}
        />
      </FormField>
      <FormField
        id="photo"
        label={t("common.optionalPhoto")}
        error={errors(c.photo)}
        help={t("common.photoFormats")}
      >
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
        />
      </FormField>
      <FormField
        id="justification"
        label={t("pages.request.justification")}
        error={errors(c.justification)}
        help={t("pages.request.justificationHelp")}
      >
        <Textarea
          id="justification"
          name="justification"
          maxLength={500}
          rows={3}
          aria-invalid={!!c.justification}
        />
      </FormField>
      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button type="submit" disabled={enCours} className="justify-self-start">
        {t("common.send")}
      </Button>
    </form>
  );
}
