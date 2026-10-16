import { ListeVide } from "@/modules/administration";
import { profilsParIds } from "@/modules/identite/server";
import { demandesEnAttente } from "@/modules/pages/server";
import { AvatarProfil } from "@/shared/composants/avatar-profil";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { ToastDepuisUrl } from "@/shared/composants/toast-depuis-url";
import { ChevronRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DateCourte } from "../_coque/date-courte";
import { adminCourant } from "../_coque/garde";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/app/admin/_coque/squelette";

/** Demandes en attente, de la plus ancienne à la plus récente (US-03). */
async function Demandes() {
  const t = await getTranslations();
  if (!(await adminCourant())) return null;
  const demandes = demandesEnAttente();
  const demandeurs = profilsParIds(demandes.map((d) => d.demandeurId));
  return (
    <section className="grid gap-4">
      <ToastDepuisUrl
        messages={{
          acceptee: t("admin.demandes.acceptee"),
          refusee: t("admin.demandes.refusee"),
        }}
      />
      <h1 className="text-xl font-semibold">{t("admin.onglets.demandes")}</h1>
      {demandes.length === 0 ? (
        <ListeVide message={t("admin.demandes.vide")} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pages.demande.nom")}</TableHead>
                <TableHead>{t("admin.demandes.demandeur")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("admin.demandes.envoyeeLe")}
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {demandes.map((d) => {
                const demandeur = demandeurs.get(d.demandeurId);
                return (
                  <TableRow key={d.id} className="relative">
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/demandes/${d.id}`}
                        className="after:absolute after:inset-0"
                      >
                        {d.nom}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <AvatarProfil
                          nom={demandeur?.nom ?? "?"}
                          photo={demandeur?.photo ?? null}
                          taille="xs"
                        />
                        {demandeur?.nom}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <DateCourte iso={d.envoyeeLe} />
                    </TableCell>
                    <TableCell className="w-8">
                      <ChevronRightIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

/** La session est lue dans Demandes, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteAdmin />}>
      <Demandes />
    </Suspense>
  );
}
