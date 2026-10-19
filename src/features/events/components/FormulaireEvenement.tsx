"use client";

import { ImageIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { Champ } from "@/shared/components/Champ";
import { useActionFormulaire } from "@/shared/hooks/useActionFormulaire";
import { useMonte } from "@/shared/hooks/useMonte";
import { useErreurs } from "@/shared/i18n/erreurs";
import type { ActionFormulaire, EtatFormulaire } from "@/shared/lib/formulaire";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import { CATEGORIES, type Evenement } from "@/features/events/lib/evenement";
import { IMAGE_PAR_DEFAUT } from "@/features/events/components/CarteEvenement";

/** ISO UTC → valeur d'un champ datetime-local dans l'heure de l'appareil (D7). */
function versLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Heure locale saisie → ISO UTC envoyé au serveur. */
function versUtc(donnees: FormData, source: string, cible: string) {
  const local = donnees.get(source);
  donnees.set(
    cible,
    typeof local === "string" && local ? new Date(local).toISOString() : "",
  );
}

function nomDuFuseau(langue: string): string {
  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const long = new Intl.DateTimeFormat(langue, { timeZoneName: "long" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value;
  return long ? `${long} (${iana})` : iana;
}

/**
 * Formulaire de création (US-11) et de modification (US-15). La page
 * organisatrice, choisie avant le formulaire, n'y est pas modifiable. Les valeurs saisies
 * sont conservées en cas d'erreur.
 */
export function FormulaireEvenement({
  page,
  evenement,
  action,
}: {
  page: { nom: string; photo: string | null };
  evenement?: Evenement;
  action: ActionFormulaire;
}) {
  const t = useTranslations();
  const langue = useLocale();
  const erreurs = useErreurs();
  const monte = useMonte();
  const {
    etat,
    onSubmit,
    enCours,
    action: envoyer,
  } = useActionFormulaire<EtatFormulaire>(action, {}, (donnees) => {
    versUtc(donnees, "debutLocal", "debut");
    versUtc(donnees, "finLocal", "fin");
  });
  const [apercu, setApercu] = useState(evenement?.photo ?? null);
  const [retirer, setRetirer] = useState(false);
  const [description, setDescription] = useState(evenement?.description ?? "");
  const c = etat.champs ?? {};

  // Les dates dépendent du fuseau de l'appareil : rendu côté navigateur uniquement.
  if (!monte) return <Skeleton className="h-[640px] w-full rounded-xl" />;

  return (
    <form
      action={envoyer}
      onSubmit={onSubmit}
      className="grid gap-6"
      noValidate
    >
      {evenement && <input type="hidden" name="id" value={evenement.id} />}

      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
        <AvatarProfil nom={page.nom} photo={page.photo} taille="sm" anneau />
        <div className="text-sm">
          <p className="text-xs text-muted-foreground">
            {t("evenements.pageOrganisatrice")}
          </p>
          <p className="font-semibold">{page.nom}</p>
        </div>
      </div>

      <Champ
        id="photo"
        libelle={t("commun.photoFacultative")}
        erreur={erreurs(c.photo)}
        aide={t("commun.formatsPhoto")}
      >
        <div className="flex items-center gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
            <img
              src={(!retirer && apercu) || IMAGE_PAR_DEFAUT}
              alt=""
              className="size-full object-cover"
            />
            {!apercu && (
              <ImageIcon className="absolute inset-0 m-auto size-6 text-white/80" />
            )}
          </div>
          <div className="grid flex-1 gap-2">
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-invalid={!!c.photo}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setApercu(
                  f ? URL.createObjectURL(f) : (evenement?.photo ?? null),
                );
                setRetirer(false);
              }}
            />
            {evenement?.photo && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="hidden"
                  name="retirerPhoto"
                  value={retirer ? "1" : ""}
                />
                <Checkbox
                  checked={retirer}
                  onCheckedChange={(v) => setRetirer(v === true)}
                />
                {t("commun.retirerPhoto")}
              </label>
            )}
          </div>
        </div>
      </Champ>

      <Champ id="nom" libelle={t("evenements.nom")} erreur={erreurs(c.nom)}>
        <Input
          id="nom"
          name="nom"
          maxLength={100}
          defaultValue={evenement?.nom}
          aria-invalid={!!c.nom}
        />
      </Champ>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          id="debutLocal"
          libelle={t("evenements.debut")}
          erreur={erreurs(c.debut)}
        >
          <Input
            id="debutLocal"
            name="debutLocal"
            type="datetime-local"
            defaultValue={versLocal(evenement?.debut ?? null)}
            aria-invalid={!!c.debut}
          />
        </Champ>
        <Champ
          id="finLocal"
          libelle={
            <>
              {t("evenements.fin")}{" "}
              <span className="font-normal text-muted-foreground">
                ({t("commun.facultatif")})
              </span>
            </>
          }
          erreur={erreurs(c.fin)}
        >
          <Input
            id="finLocal"
            name="finLocal"
            type="datetime-local"
            defaultValue={versLocal(evenement?.fin ?? null)}
            aria-invalid={!!c.fin}
          />
        </Champ>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          {t("evenements.fuseau", { fuseau: nomDuFuseau(langue) })}
        </p>
      </div>

      <Champ id="lieu" libelle={t("evenements.lieu")} erreur={erreurs(c.lieu)}>
        <Input
          id="lieu"
          name="lieu"
          maxLength={150}
          defaultValue={evenement?.lieu}
          aria-invalid={!!c.lieu}
        />
      </Champ>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">
          {t("evenements.categories")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input
                type="checkbox"
                name="categories"
                value={cat}
                defaultChecked={evenement?.categories.includes(cat)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1.5 text-sm transition-colors select-none",
                  "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
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
            {erreurs(c.categories)}
          </p>
        )}
      </fieldset>

      <Champ
        id="description"
        libelle={
          <>
            {t("evenements.description")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("commun.facultatif")})
            </span>
          </>
        }
        erreur={erreurs(c.description)}
        aide={t("commun.caracteres", { n: description.length, max: 2000 })}
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
      </Champ>

      {etat.erreur && (
        <p
          role="alert"
          className="rounded-lg bg-danger-fond p-3 text-sm text-danger"
        >
          {erreurs(etat.erreur)}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={enCours}
        className="sm:justify-self-start"
      >
        {evenement ? t("commun.enregistrer") : t("evenements.publier")}
      </Button>
    </form>
  );
}
