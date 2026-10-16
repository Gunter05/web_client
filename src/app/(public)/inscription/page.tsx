import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { FormulaireInscription } from "@/modules/identite";
import { compteCourant } from "@/modules/identite/server";
import { actionInscription } from "../../_actions/identite";
import { CarteAuth } from "../_coque/carte-auth";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

/** Inscription ouverte à tous. */
async function Inscription({ searchParams }: PageProps<"/inscription">) {
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
          <Link href="/connexion" className="font-semibold text-lien">
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
export default function Page(props: PageProps<"/inscription">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Inscription {...props} />
    </Suspense>
  );
}
