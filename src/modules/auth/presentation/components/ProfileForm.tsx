"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { usePhotoUpload } from "@/modules/medias";

/** Profil personnel : nom et photo, affichés dans le sélecteur de profil. */
export function ProfileForm({
  action,
  name,
  photo,
}: {
  action: FormAction;
  name: string;
  photo: string | null;
}) {
  const t = useTranslations();
  const errors = useErrorMessages();
  const {
    state,
    onSubmit,
    enCours,
    action: send,
  } = useFormAction<FormState>(action, {});
  const [preview, setPreview] = useState(photo);
  // La photo part dès qu'elle est choisie ; le formulaire n'envoie que son adresse.
  const upload = usePhotoUpload();
  const [typedName, setTypedName] = useState(name);
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="flex items-center gap-4">
        <ProfileAvatar name={typedName || "?"} photo={preview} size="lg" />
        <FormField
          id="photo"
          label={t("common.photo")}
          error={errors(
            upload.error ??
              state.fieldErrors?.photo ??
              state.fieldErrors?.photoUrl,
          )}
          help={
            upload.uploading
              ? t("common.photoUploading")
              : t("common.photoFormats")
          }
          className="flex-1"
        >
          <input type="hidden" name="photoUrl" value={upload.url ?? ""} />
          <Input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-invalid={!!upload.error}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                void upload.upload(file);
              } else upload.reset();
            }}
          />
        </FormField>
      </div>
      <FormField
        id="name"
        label={t("auth.name")}
        error={errors(state.fieldErrors?.name)}
      >
        <Input
          id="name"
          name="name"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          aria-invalid={!!state.fieldErrors?.name}
        />
      </FormField>
      <Button
        type="submit"
        disabled={enCours || upload.uploading}
        className="justify-self-start"
      >
        {t("common.save")}
      </Button>
    </form>
  );
}
