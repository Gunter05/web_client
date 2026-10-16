"use client";

import { BellIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { Notification } from "../domain/notification";

const INTERVALLE_MS = 15_000;

export type ActionsNotifications = {
  compter: () => Promise<number>;
  lister: () => Promise<Notification[]>;
  marquerLues: () => Promise<void>;
};

/**
 * Cloche avec compteur de non-lues, mis à jour sans recharger la page (D8)
 * par interrogation régulière. Ouvrir la liste marque tout comme lu.
 */
export function Cloche({
  nonLuesInitiales,
  actions,
  libelle = false,
  classeLibelle,
  className,
}: {
  nonLuesInitiales: number;
  actions: ActionsNotifications;
  libelle?: boolean;
  /** Classes du libellé, pour qu'une barre réduite puisse le masquer. */
  classeLibelle?: string;
  className?: string;
}) {
  const t = useTranslations("notifications");
  const format = useFormatter();
  const [nonLues, setNonLues] = useState(nonLuesInitiales);
  const [liste, setListe] = useState<Notification[] | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      if (document.visibilityState === "visible") {
        setNonLues(await actions.compter());
      }
    }, INTERVALLE_MS);
    return () => clearInterval(id);
  }, [actions]);

  async function ouvrir(ouvert: boolean) {
    if (!ouvert) return;
    setListe(await actions.lister());
    if (nonLues > 0) {
      await actions.marquerLues();
      setNonLues(0);
    }
  }

  return (
    <Popover onOpenChange={ouvrir}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size={libelle ? "lg" : "icon-lg"}
            className={cn(
              libelle && "h-12 w-full justify-start gap-4 px-3 font-normal",
              className,
            )}
            aria-label={nonLues ? `${t("titre")} (${nonLues})` : t("titre")}
          />
        }
      >
        <span className="relative">
          <BellIcon className="size-6" />
          {nonLues > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid min-w-4.5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {nonLues > 9 ? "9+" : nonLues}
            </span>
          )}
        </span>
        {libelle && (
          <span className={cn("text-base", classeLibelle)}>{t("titre")}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <p className="border-b px-4 py-3 font-semibold">{t("titre")}</p>
        <div className="max-h-96 overflow-y-auto">
          {liste === null ? (
            <p className="p-4 text-sm text-muted-foreground">…</p>
          ) : liste.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {t("vide")}
            </p>
          ) : (
            <ul className="divide-y">
              {liste.map((n) => {
                const contenu = (
                  <>
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        !n.lue && "bg-marque-2",
                      )}
                      aria-hidden
                    />
                    <span className="grid gap-0.5">
                      <span className="text-sm">{t(n.type, n.params)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format.relativeTime(new Date(n.creeLe))}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={n.id}>
                    {n.lien ? (
                      <Link
                        href={n.lien}
                        className="flex gap-3 px-4 py-3 hover:bg-muted"
                      >
                        {contenu}
                      </Link>
                    ) : (
                      <div className="flex gap-3 px-4 py-3">{contenu}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
