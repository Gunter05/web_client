"use client";

import { ImageIcon } from "@/shared/components/icons";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useMounted } from "@/shared/hooks/useMounted";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";
import { usePhotoUpload } from "@/modules/medias";
import { CATEGORIES, type Event } from "@/modules/events/domain/event";
import { DEFAULT_IMAGE } from "@/modules/events/presentation/components/EventCard";

/** ISO UTC → valeur d'un champ datetime-local dans l'heure de l'appareil (D7). */
function toLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Heure locale saisie → ISO UTC envoyé au serveur. */
function toUtc(formData: FormData, source: string, target: string) {
  const local = formData.get(source);
  formData.set(
    target,
    typeof local === "string" && local ? new Date(local).toISOString() : "",
  );
}

function zoneName(locale: string): string {
  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const long = new Intl.DateTimeFormat(locale, { timeZoneName: "long" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value;
  return long ? `${long} (${iana})` : iana;
}

/**
 * Formulaire de création (US-11) et de modification (US-15). La page
 * organisatrice, choisie avant le formulaire, n'y est pas modifiable. Les valeurs saisies
 * sont conservées en cas d'erreur.
 */
export function EventForm({
  page,
  event,
  action,
}: {
  page: { name: string; photoUrl: string | null };
  event?: Event;
  action: FormAction;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const errors = useErrorMessages();
  const mounted = useMounted();
  const {
    state,
    onSubmit,
    enCours,
    action: send,
  } = useFormAction<FormState>(action, {}, (formData) => {
    toUtc(formData, "startsAtLocal", "startsAt");
    toUtc(formData, "endsAtLocal", "endsAt");
  });
  const [preview, setPreview] = useState(event?.photoUrl ?? null);
  const [remove, setRemove] = useState(false);
  // La photo part dès qu'elle est choisie ; le formulaire n'envoie que son adresse.
  const photo = usePhotoUpload();
  const [description, setDescription] = useState(event?.description ?? "");
  const c = state.fieldErrors ?? {};

  // Les dates dépendent du fuseau de l'appareil : rendu côté navigateur uniquement.
  if (!mounted) return <Skeleton className="h-[640px] w-full rounded-xl" />;

  return (
    <form action={send} onSubmit={onSubmit} className="grid gap-6" noValidate>
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
        <ProfileAvatar name={page.name} photo={page.photoUrl} size="sm" />
        <div className="text-sm">
          <p className="text-xs text-muted-foreground">
            {t("events.organizerPage")}
          </p>
          <p className="font-semibold">{page.name}</p>
        </div>
      </div>

      <FormField
        id="photo"
        label={t("common.optionalPhoto")}
        error={errors(photo.error ?? c.photo ?? c.photoUrl)}
        help={
          photo.uploading
            ? t("common.photoUploading")
            : t("common.photoFormats")
        }
      >
        <input type="hidden" name="photoUrl" value={photo.url ?? ""} />
        <div className="flex items-center gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
            <img
              src={(!remove && preview) || DEFAULT_IMAGE}
              alt=""
              className="size-full object-cover"
            />
            {!preview && (
              <ImageIcon className="absolute inset-0 m-auto size-6 text-white/80" />
            )}
          </div>
          <div className="grid flex-1 gap-2">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              aria-invalid={!!(photo.error ?? c.photo)}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(
                  f ? URL.createObjectURL(f) : (event?.photoUrl ?? null),
                );
                setRemove(false);
                if (f) void photo.upload(f);
                else photo.reset();
              }}
            />
            {event?.photoUrl && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="hidden"
                  name="removePhoto"
                  value={remove ? "1" : ""}
                />
                <Checkbox
                  checked={remove}
                  onCheckedChange={(v) => setRemove(v === true)}
                />
                {t("common.removePhoto")}
              </label>
            )}
          </div>
        </div>
      </FormField>

      <FormField id="name" label={t("events.name")} error={errors(c.name)}>
        <Input
          id="name"
          name="name"
          maxLength={100}
          defaultValue={event?.name}
          aria-invalid={!!c.name}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="startsAtLocal"
          label={t("events.startsAt")}
          error={errors(c.startsAt)}
        >
          <Input
            id="startsAtLocal"
            name="startsAtLocal"
            type="datetime-local"
            defaultValue={toLocal(event?.startsAt ?? null)}
            aria-invalid={!!c.startsAt}
          />
        </FormField>
        <FormField
          id="endsAtLocal"
          label={
            <>
              {t("events.endsAt")}{" "}
              <span className="font-normal text-muted-foreground">
                ({t("common.optional")})
              </span>
            </>
          }
          error={errors(c.endsAt)}
        >
          <Input
            id="endsAtLocal"
            name="endsAtLocal"
            type="datetime-local"
            defaultValue={toLocal(event?.endsAt ?? null)}
            aria-invalid={!!c.endsAt}
          />
        </FormField>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          {t("events.timeZone", { timeZone: zoneName(locale) })}
        </p>
      </div>

      <FormField
        id="location"
        label={t("events.location")}
        error={errors(c.location)}
      >
        <Input
          id="location"
          name="location"
          maxLength={150}
          defaultValue={event?.location}
          aria-invalid={!!c.location}
        />
      </FormField>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">
          {t("events.categories")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input
                type="checkbox"
                name="categories"
                value={cat}
                defaultChecked={event?.categories.includes(cat)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1.5 text-sm transition-colors select-none",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ink-foreground",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                )}
              >
                {t(`categories.${cat}`)}
              </span>
            </label>
          ))}
        </div>
        {c.categories && (
          <p role="alert" className="text-sm text-destructive">
            {errors(c.categories)}
          </p>
        )}
      </fieldset>

      <FormField
        id="description"
        label={
          <>
            {t("events.description")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("common.optional")})
            </span>
          </>
        }
        error={errors(c.description)}
        help={t("common.characters", { n: description.length, max: 2000 })}
      >
        <Textarea
          id="description"
          name="description"
          rows={5}
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!c.description}
        />
      </FormField>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-danger-fond p-3 text-sm text-danger"
        >
          {errors(state.error)}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={enCours || photo.uploading}
        className="sm:justify-self-start"
      >
        {event ? t("common.save") : t("events.publish")}
      </Button>
    </form>
  );
}
