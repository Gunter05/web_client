import { ListeVide } from "@/features/admin";
import { demandesEnAttente } from "@/features/pages/server";
import { AvatarProfil } from "@/shared/components/AvatarProfil";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ToastDepuisUrl } from "@/shared/components/ToastDepuisUrl";
import { ChevronRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DateCourte } from "@/features/admin";
import { adminCourant } from "@/features/admin/server";
import { Suspense } from "react";
import { SqueletteAdmin } from "@/widgets/admin-shell/SqueletteAdmin";

/** Demandes en attente, de la plus ancienne à la plus récente (US-03). */
async function Demandes() {
  const t = await getTranslations();
  if (!(await adminCourant())) return null;
  const demandes = await demandesEnAttente();
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
                const demandeur = d.demandeur;
                return (
                  <TableRow key={d.id} className="relative">
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/page-requests/${d.id}`}
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
