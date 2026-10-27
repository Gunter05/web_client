"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { useErrorMessages } from "@/shared/i18n/errors";
import { Button } from "@/shared/ui/button";

type Status = "DRAFT" | "ACTIVE" | "PAUSED";

/** Activer une campagne, la mettre en pause ou la repasser en brouillon. */
export function CampaignStatusControl({
  status,
  change,
}: {
  status: Status;
  change: (status: Status) => Promise<{ error?: string }>;
}) {
  const t = useTranslations("admin.campaigns");
  const errors = useErrorMessages();
  const [pending, start] = useTransition();
  const run = (next: Status, done: string) =>
    start(async () => {
      const { error } = await change(next);
      if (error) toast.error(errors(error));
      else toast.success(done);
    });
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "ACTIVE" && (
        <Button
          size="sm"
          disabled={pending}
          onClick={() => run("ACTIVE", t("activated"))}
        >
          {t("activate")}
        </Button>
      )}
      {status === "ACTIVE" && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run("PAUSED", t("paused"))}
        >
          {t("pause")}
        </Button>
      )}
      {status === "PAUSED" && (
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => run("DRAFT", t("drafted"))}
        >
          {t("toDraft")}
        </Button>
      )}
    </div>
  );
}
