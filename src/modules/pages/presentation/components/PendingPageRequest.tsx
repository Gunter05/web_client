"use client";

import { ClockIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useMounted } from "@/shared/hooks/useMounted";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

/** Demande en attente, que l'utilisateur peut retirer (US-03). */
export function PendingPageRequest({
  name,
  submittedAt,
  remove,
}: {
  name: string;
  submittedAt: string;
  remove: () => Promise<void>;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const mounted = useMounted();
  const [enCours, startTransition] = useTransition();
  return (
    <div className="grid gap-4 rounded-xl border p-5">
      <Badge variant="secondary" className="w-fit gap-1">
        <ClockIcon className="size-3" /> {t("pages.request.pending")}
      </Badge>
      <p className="text-sm">
        {t("pages.request.pendingDetail", {
          name,
          date: mounted
            ? format.dateTime(new Date(submittedAt), {
                dateStyle: "long",
                timeStyle: "short",
              })
            : "…",
        })}
      </p>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              disabled={enCours}
              className="justify-self-start"
            />
          }
        >
          {t("pages.request.withdraw")}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("pages.request.withdrawConfirmation")}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => startTransition(remove)}>
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
