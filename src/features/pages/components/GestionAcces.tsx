"use client";

import { SearchIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { AvatarProfil } from "@/shared/components/AvatarProfil";
import { useMonte } from "@/shared/hooks/useMonte";
import { useErreurs } from "@/shared/i18n/erreurs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export type LigneMembre = {
  compteId: string;
  nom: string;
  photo: string | null;
  role: "proprietaire" | "contributeur";
  ajouteLe: string;
};

export type ResultatRecherche = {
  id: string;
  nom: string;
  photo: string | null;
  membre: boolean;
}[];

/** Rubrique « Accès » du propriétaire (US-06). */
export function GestionAcces({
  membres,
  rechercher,
  donner,
  retirer,
}: {
  membres: LigneMembre[];
  rechercher: (requete: string) => Promise<ResultatRecherche>;
  donner: (compteId: string) => Promise<{ erreur?: string; nom?: string }>;
  retirer: (compteId: string) => Promise<{ erreur?: string }>;
}) {
  const t = useTranslations();
  const erreurs = useErreurs();
  const format = useFormatter();
  const monte = useMonte();
  const router = useRouter();
  const [requete, setRequete] = useState("");
  const [resultats, setResultats] = useState<ResultatRecherche | null>(null);
  const [enCours, demarrer] = useTransition();

  const q = requete.trim();
  const rechercheActive = q.includes("@") || q.length >= 3;

  useEffect(() => {
    if (!rechercheActive) return;
    const minuterie = setTimeout(
      async () => setResultats(await rechercher(q)),
      250,
    );
    return () => clearTimeout(minuterie);
  }, [q, rechercheActive, rechercher]);

  const donnerAcces = (id: string) =>
    demarrer(async () => {
      const r = await donner(id);
      if (r.erreur) {
        toast.error(erreurs(r.erreur));
        return;
      }
      toast.success(t("pages.acces.accesDonne", { nom: r.nom ?? "" }));
      setResultats(
        (l) =>
          l?.map((p) => (p.id === id ? { ...p, membre: true } : p)) ?? null,
      );
      router.refresh();
    });

  const retirerAcces = (id: string) =>
    demarrer(async () => {
      const r = await retirer(id);
      if (r.erreur) {
        toast.error(erreurs(r.erreur));
        return;
      }
      toast.success(t("pages.acces.accesRetire"));
      router.refresh();
    });

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="recherche" className="text-sm font-medium">
          {t("pages.acces.rechercher")}
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="recherche"
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            className="pl-8"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("pages.acces.aideRecherche")}
        </p>
        {rechercheActive && resultats && (
          <ul className="grid divide-y rounded-xl border">
            {resultats.length === 0 && (
              <li className="p-3 text-sm text-muted-foreground">
                {t("pages.acces.aucunResultat")}
              </li>
            )}
            {resultats.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <AvatarProfil nom={p.nom} photo={p.photo} taille="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {p.nom}
                </span>
                {p.membre ? (
                  <Badge variant="secondary">
                    {t("pages.acces.dejaMembre")}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    disabled={enCours}
                    onClick={() => donnerAcces(p.id)}
                  >
                    {t("pages.acces.donner")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="grid divide-y rounded-xl border">
        {membres.map((m) => (
          <li key={m.compteId} className="flex items-center gap-3 p-3">
            <AvatarProfil nom={m.nom} photo={m.photo} taille="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{m.nom}</p>
              <p className="text-xs text-muted-foreground">
                {m.role === "proprietaire"
                  ? t("pages.roles.proprietaire")
                  : t("pages.acces.ajouteLe", {
                      date: monte
                        ? format.dateTime(new Date(m.ajouteLe), {
                            dateStyle: "medium",
                          })
                        : "…",
                    })}
              </p>
            </div>
            {m.role === "contributeur" && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="outline" size="sm" disabled={enCours} />
                  }
                >
                  {t("pages.acces.retirer")}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("pages.acces.retirerConfirmation", { nom: m.nom })}
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("commun.annuler")}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => retirerAcces(m.compteId)}>
                      {t("commun.confirmer")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
