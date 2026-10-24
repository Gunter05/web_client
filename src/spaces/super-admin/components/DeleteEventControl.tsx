"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TrashIcon } from "@/shared/components/icons";
import { useErrorMessages } from "@/shared/i18n/errors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

/**
 * Suppression définitive d'un événement (ADR 0021 du backend), après une
 * confirmation qui dit ce qui disparaît : irréversible.
 */
export function DeleteEventControl({
  name,
  remove,
}: {
  name: string;
  remove: () => Promise<{ error?: string }>;
}) {
  const t = useTranslations();
  const errors = useErrorMessages();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const confirm = () =>
    start(async () => {
      const { error } = await remove();
      if (error) {
        toast.error(errors(error));
        return;
      }
      setOpen(false);
      toast.success(t("admin.events.deleted"));
    });
  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <TrashIcon /> {t("admin.events.delete")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("admin.events.deleteTitle", { name })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.events.deleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={confirm}
          >
            {t("admin.events.deleteConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
