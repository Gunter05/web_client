import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ListePagesMembre } from "@/features/pages";
import { buttonVariants } from "@/shared/components/ui/button";
import { acteurCourant } from "@/features/pages/server";
import { EnTetePage } from "@/shared/components/layout/EnTetePage";
import { SqueletteContenu } from "@/shared/components/layout/SqueletteContenu";

/** « Mes pages » : les pages dont on est membre, point d'entrée de leur gestion (US-06, US-39). */
async function MesPages() {
  const acteur = await acteurCourant();
  if (!acteur) redirect("/login?retour=/my-pages");
  const t = await getTranslations();
  return (
    <div className="mx-auto grid max-w-2xl gap-4 px-4 pt-6 md:pt-10">
      <EnTetePage
        titre={t("pages.mesPages.titre")}
        sousTitre={t("pages.mesPages.intro")}
      />
      {acteur.pages.length === 0 ? (
        <p className="rounded-xl border bg-muted/40 p-4 text-sm">
          {t("pages.mesPages.vide")}
        </p>
      ) : (
        <ListePagesMembre
          pages={acteur.pages}
          lien={(p) => `/my-pages/${encodeURIComponent(p.slug)}`}
        />
      )}
      <Link
        href="/page-request"
        className={buttonVariants({
          variant: "outline",
          className: "justify-self-start",
        })}
      >
        <PlusIcon /> {t("nav.demanderPage")}
      </Link>
    </div>
  );
}

/** La session est lue dans MesPages, derrière ce Suspense (Cache Components). */
export default function Page() {
  return (
    <Suspense fallback={<SqueletteContenu />}>
      <MesPages />
    </Suspense>
  );
}
