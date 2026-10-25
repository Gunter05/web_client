"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { CameraIcon } from "@/shared/components/icons";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { usePhotoUpload } from "@/modules/medias";

/**
 * Profil personnel : nom et photo. La photo se change d'un clic sur elle ;
 * « Enregistrer » (secondaire) n'apparaît qu'après une modification.
 */
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
  const photoId = useId();
  // Nom changé ou nouvelle photo choisie
  const changed = typedName.trim() !== name || preview !== photo;
  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-5" noValidate>
      {/* Photo : un clic dessus (ou sur l'appareil photo) la change */}
      <div className="grid justify-items-start gap-2">
        <input type="hidden" name="photoUrl" value={upload.url ?? ""} />
        <label
          htmlFor={photoId}
          title={t("profile.changePhoto")}
          className="relative cursor-pointer rounded-full outline-none focus-within:ring-3 focus-within:ring-ring/50"
        >
          <ProfileAvatar name={typedName || "?"} photo={preview} size="xl" />
          <span className="absolute -right-0.5 -bottom-0.5 grid size-8 place-items-center rounded-full border-2 border-background bg-foreground text-background shadow-sm [&_svg]:size-4">
            <CameraIcon />
          </span>
          <input
            id={photoId}
            type="file"
            accept="image/*"
            aria-label={t("profile.changePhoto")}
            aria-invalid={!!upload.error}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPreview(URL.createObjectURL(file));
              void upload.upload(file);
            }}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          {upload.uploading
            ? t("common.photoUploading")
            : t("common.photoFormats")}
        </p>
        {(upload.error ??
          state.fieldErrors?.photo ??
          state.fieldErrors?.photoUrl) && (
          <p role="alert" className="text-sm text-destructive">
            {errors(
              upload.error ??
                state.fieldErrors?.photo ??
                state.fieldErrors?.photoUrl,
            )}
          </p>
        )}
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
      {/* N'apparaît qu'après une modification */}
      {changed && (
        <Button
          type="submit"
          variant="secondary"
          disabled={enCours || upload.uploading}
          className="justify-self-start motion-safe:animate-rise"
        >
          {t("common.save")}
        </Button>
      )}
    </form>
  );
}
