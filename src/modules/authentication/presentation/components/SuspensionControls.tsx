"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useErrorMessages } from "@/shared/i18n/errors";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

const DURATIONS = [1, 7, 30] as const;

/**
 * Suspendre un compte (1, 7 ou 30 jours, ou sans fin) ou le réactiver, depuis
 * la liste des comptes de l'administration. Le compte est déconnecté partout.
 */
export function SuspensionControls({
  accountId,
  suspended,
  suspend,
  reactivate,
}: {
  accountId: string;
  suspended: boolean;
  suspend: (
    accountId: string,
    days: number | null,
  ) => Promise<string | undefined>;
  reactivate: (accountId: string) => Promise<string | undefined>;
}) {
  const t = useTranslations("admin.accounts");
  const errors = useErrorMessages();
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (call: () => Promise<string | undefined>, done: string) =>
    start(async () => {
      const code = await call();
      if (code) toast.error(errors(code));
      else toast.success(done);
      router.refresh();
    });

  if (suspended) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => run(() => reactivate(accountId), t("reactivated"))}
      >
        {t("reactivate")}
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" disabled={pending} />}
      >
        {t("suspend")}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {DURATIONS.map((days) => (
          <DropdownMenuItem
            key={days}
            onClick={() => run(() => suspend(accountId, days), t("suspended"))}
          >
            {t("suspendFor", { days })}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          variant="destructive"
          onClick={() => run(() => suspend(accountId, null), t("suspended"))}
        >
          {t("suspendIndefinitely")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
