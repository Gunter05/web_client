"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FormField } from "@/shared/components/FormField";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { usePhotoUpload } from "@/modules/medias";
import {
  ORGANIZATION_TYPES,
  type Page,
} from "@/modules/pages/domain/page.types";

/**
 * « Modifier la page », réservé au propriétaire : photo, nom, type et
 * description, comme « Modifier le profil » d'un réseau social.
 */
export function PageEditForm({
  page,
  action,
}: {
  page: Page;
  action: FormAction;
}) {
  const t = useTranslations();
  const errors = useErrorMessages();
  const {
    state,
    onSubmit,
    enCours,
    action: send,
  } = useFormAction<FormState>(action, {});
  const c = state.fieldErrors ?? {};
  const [preview, setPreview] = useState(page.photoUrl);
  const [remove, setRemove] = useState(false);
  // La photo part dès qu'elle est choisie ; le formulaire n'envoie que son adresse.
  const photo = usePhotoUpload();
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
        <ProfileAvatar
          name={page.name}
          photo={remove ? null : preview}
          size="lg"
        />
        <div className="grid min-w-0 flex-1 gap-1">
          <p className="truncate font-semibold">{page.name}</p>
          <p className="truncate text-sm text-muted-foreground">@{page.slug}</p>
        </div>
      </div>
      <FormField
        id="photo"
        label={t("pages.edit.photo")}
        error={errors(photo.error ?? c.photo ?? c.photoUrl)}
        help={
          photo.uploading
            ? t("common.photoUploading")
            : t("common.photoFormats")
        }
      >
        <input type="hidden" name="photoUrl" value={photo.url ?? ""} />
        <input type="hidden" name="removePhoto" value={remove ? "1" : ""} />
        <div className="grid gap-2">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            aria-invalid={!!(photo.error ?? c.photo)}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : page.photoUrl);
              setRemove(false);
              if (f) void photo.upload(f);
              else photo.reset();
            }}
          />
          {page.photoUrl && (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={remove}
                onCheckedChange={(v) => setRemove(v === true)}
              />
              {t("common.removePhoto")}
            </label>
          )}
        </div>
      </FormField>
      <FormField
        id="name"
        label={t("pages.request.name")}
        error={errors(c.name)}
        help={t("pages.edit.linkKept", { slug: page.slug })}
      >
        <Input
          id="name"
          name="name"
          maxLength={60}
          defaultValue={page.name}
          aria-invalid={!!c.name}
        />
      </FormField>
      <FormField
        id="type"
        label={t("pages.request.type")}
        error={errors(c.type)}
      >
        <select
          id="type"
          name="type"
          defaultValue={page.type}
          aria-invalid={!!c.type}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        >
          {ORGANIZATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`pages.types.${type}`)}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        id="description"
        label={t("pages.edit.bio")}
        error={errors(c.description)}
      >
        <Textarea
          id="description"
          name="description"
          maxLength={500}
          rows={4}
          defaultValue={page.description}
          aria-invalid={!!c.description}
        />
      </FormField>
      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-destructive">
          {errors(state.error)}
        </p>
      )}
      <Button
        type="submit"
        disabled={enCours || photo.uploading}
        className="justify-self-start"
      >
        {t("common.save")}
      </Button>
    </form>
  );
}
