import { CalendarXIcon, PencilIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { CompteurVues, TraceurOuverture } from "@/modules/audience";
import { compterVues } from "@/modules/audience/server";
import {
  BoutonPartager,
  DialogueAnnulation,
  estModifiable,
  FicheEvenement,
} from "@/modules/evenements";
import { evenementParId } from "@/modules/evenements/server";
import { ToastDepuisUrl } from "@/shared/composants/toast-depuis-url";
import { env } from "@/shared/config/env";
import { clientEnv } from "@/shared/config/env.client";
import { formaterDateEvenement } from "@/shared/i18n/dates";
import { buttonVariants } from "@/shared/ui/button";
import {
  actionClicPartager,
  actionOuvertureFiche,
} from "../../../_actions/audience";
import { actionAnnulerEvenement } from "../../../_actions/evenements";
import { profilActif } from "../../../_services/acteur";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

const charger = (id: string) => evenementParId(id);

/**
 * Aperçu WhatsApp (US-36) : nom, image et « [date] · [lieu] », préfixé de
 * « ANNULÉ · » si besoin. Calculé côté serveur dans le fuseau FUSEAU_APERCU.
 */
export async function generateMetadata({
  params,
}: PageProps<"/e/[id]">): Promise<Metadata> {
  const evenement = await charger((await params).id);
  const t = await getTranslations();
  if (!evenement) return { title: t("evenements.introuvable") };
  const date = formaterDateEvenement(
    evenement.debut,
    await getLocale(),
    {
      aujourdhui: (heure) => t("dates.aujourdhui", { heure }),
      demain: (heure) => t("dates.demain", { heure }),
    },
    new Date(),
    env.FUSEAU_APERCU,
  );
  const prefixe =
    evenement.statut === "annule" ? t("partage.annulePrefixe") : "";
  const ligne = `${prefixe}${date} · ${evenement.lieu}`;
  return {
    title: evenement.nom,
    description: ligne,
    alternates: { canonical: `/e/${evenement.id}` },
    openGraph: {
      type: "website",
      title: evenement.nom,
      description: ligne,
      url: `/e/${evenement.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: evenement.nom,
      description: ligne,
    },
  };
}

/** Fiche d'un événement, accessible sans compte (US-01, US-15, US-36, US-39). */
async function PageFiche({ params }: PageProps<"/e/[id]">) {
  const { id } = await params;
  const t = await getTranslations();
  const evenement = await charger(id);

  if (!evenement) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
        <CalendarXIcon className="size-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">{t("evenements.introuvable")}</h1>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          {t("evenements.retourListe")}
        </Link>
      </div>
    );
  }

  // Affichage selon le profil actif ; chaque action est revérifiée par le serveur.
  const etat = await profilActif();
  const organisatrice =
    etat?.actif.type === "page" && etat.actif.id === evenement.pageId;
  const modifiable = estModifiable(evenement, new Date());

  return (
    <div className="mx-auto max-w-5xl md:px-6 md:pt-8">
      <ToastDepuisUrl
        messages={{
          enLigne: t("evenements.enLigne"),
          modifie: t("evenements.modificationsEnregistrees"),
          annule: t("evenements.annulationEnregistree"),
        }}
      />
      <TraceurOuverture
        signaler={actionOuvertureFiche.bind(null, evenement.id)}
      />
      <FicheEvenement
        evenement={evenement}
        vues={
          organisatrice ? (
            <CompteurVues
              n={
                (await compterVues(evenement.pageId, [evenement.id])).get(
                  evenement.id,
                ) ?? 0
              }
            />
          ) : null
        }
        actions={
          <>
            <BoutonPartager
              url={`${clientEnv.NEXT_PUBLIC_SITE_URL}/e/${evenement.id}`}
              titre={evenement.nom}
              texte={evenement.nom}
              onPartage={actionClicPartager.bind(null, evenement.id)}
              className="flex-1 sm:flex-none"
            />
            {organisatrice && modifiable && (
              <>
                <Link
                  href={`/e/${evenement.id}/modifier`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <PencilIcon /> {t("evenements.modifier")}
                </Link>
                <DialogueAnnulation
                  evenementId={evenement.id}
                  action={actionAnnulerEvenement}
                />
              </>
            )}
          </>
        }
      />
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans PageFiche, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/e/[id]">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <PageFiche {...props} />
    </Suspense>
  );
}
