import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ComptesDemo, FormulaireConnexion } from "@/modules/identite";
import { compteCourant } from "@/modules/identite/server";
import { actionConnexion } from "../../_actions/identite";
import { CarteAuth } from "../_coque/carte-auth";
import { Suspense } from "react";
import { SqueletteContenu } from "@/app/(public)/_coque/squelette";

async function Connexion({ searchParams }: PageProps<"/connexion">) {
  const { retour } = await searchParams;
  const cible = typeof retour === "string" ? retour : "/";
  if (await compteCourant()) redirect(cible.startsWith("/") ? cible : "/");
  const t = await getTranslations();
  return (
    <CarteAuth
      titre={t("identite.titreConnexion")}
      pied={
        <>
          {t("identite.pasDeCompte")}{" "}
          <Link
            href={`/inscription?retour=${encodeURIComponent(cible)}`}
            className="font-semibold text-lien"
          >
            {t("nav.inscription")}
          </Link>
        </>
      }
    >
      <FormulaireConnexion action={actionConnexion} retour={cible} />
      <ComptesDemo />
    </CarteAuth>
  );
}

/**
 * Les paramètres d'URL et la session sont lus dans Connexion, derrière ce
 * Suspense : le cadre de la page reste instantané (Cache Components).
 */
export default function Page(props: PageProps<"/connexion">) {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <Connexion {...props} />
    </Suspense>
  );
}
