import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { FormulaireInscription } from "@/features/auth";
import { compteCourant } from "@/features/auth/server";
import { actionInscription } from "@/features/auth/actions/auth.actions";
import { CarteAuth } from "@/features/auth";
import { Suspense } from "react";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/** Inscription ouverte à tous. */
async function Inscription({ searchParams }: PageProps<"/register">) {
  const { retour } = await searchParams;
  const cible = typeof retour === "string" ? retour : "/";
  if (await compteCourant()) redirect(cible.startsWith("/") ? cible : "/");
  const t = await getTranslations();
  return (
    <CarteAuth
      titre={t("identite.titreInscription")}
      sousTitre={t("identite.sousTitreInscription")}
      pied={
        <>
          {t("identite.dejaUnCompte")}{" "}
          <Link href="/login" className="font-semibold text-lien">
            {t("nav.connexion")}
          </Link>
        </>
      }
    >
      <FormulaireInscription action={actionInscription} retour={cible} />
    </CarteAuth>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Inscription, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Inscription {...props} />
    </Suspense>
  );
}
