import { demandeParId } from "@/modules/pages/server";
import { DecisionDemande } from "@/modules/pages";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
  actionAccepterDemande,
  actionRefuserDemande,
} from "../../../_actions/admin";
import { DateCourte } from "../../_coque/date-courte";
import { adminCourant } from "../../_coque/garde";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

/** Formulaire complet d'une demande et décision (US-03). */
async function Demande({ params }: PageProps<"/admin/demandes/[id]">) {
  const t = await getTranslations();
  if (!(await adminCourant())) return null;
  const demande = await demandeParId((await params).id);
  if (!demande) notFound();
  const demandeur = demande.demandeur;
  return (
    <section className="grid max-w-2xl gap-6">
      <Link
        href="/admin/demandes"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "justify-self-start",
        })}
      >
        <ArrowLeftIcon /> {t("admin.onglets.demandes")}
      </Link>
      <div className="grid gap-6 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <AvatarProfil
            nom={demande.nom}
            photo={demande.photo}
            taille="lg"
            anneau
          />
          <div className="grid gap-1">
            <h1 className="text-xl font-semibold">{demande.nom}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {t(`pages.types.${demande.type}`)}
              </Badge>
              <Badge variant="outline">
                {t(`admin.demandes.statut.${demande.statut}`)}
              </Badge>
            </div>
          </div>
        </div>
        <dl className="grid gap-4 text-sm">
          <Ligne libelle={t("admin.demandes.demandeur")}>
            <span className="flex items-center gap-2">
              <AvatarProfil
                nom={demandeur?.nom ?? "?"}
                photo={demandeur?.photo ?? null}
                taille="xs"
              />{" "}
              {demandeur?.nom}
            </span>
          </Ligne>
          <Ligne libelle={t("admin.demandes.envoyeeLe")}>
            <DateCourte iso={demande.envoyeeLe} />
          </Ligne>
          <Ligne libelle={t("pages.demande.description")}>
            <p className="whitespace-pre-line">{demande.description}</p>
          </Ligne>
          <Ligne libelle={t("pages.demande.justification")}>
            <p className="whitespace-pre-line">{demande.justification}</p>
          </Ligne>
          {demande.motifRefus && (
            <Ligne libelle={t("admin.demandes.motifRefus")}>
              {demande.motifRefus}
            </Ligne>
          )}
        </dl>
        {demande.statut === "en_attente" ? (
          <DecisionDemande
            demandeId={demande.id}
            accepter={actionAccepterDemande.bind(null, demande.id)}
            refuser={actionRefuserDemande}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("admin.demandes.dejaTraitee")}
          </p>
        )}
      </div>
    </section>
  );
}

function Ligne({
  libelle,
  children,
}: {
  libelle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-medium text-muted-foreground uppercase">
        {libelle}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Demande, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/admin/demandes/[id]">) {
  return (
    <Suspense fallback={<SqueletteAdmin />}>
      <Demande {...props} />
    </Suspense>
  );
}
