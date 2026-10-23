"use client";

import { LaptopIcon, SmartphoneIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useErrorMessages } from "@/shared/i18n/errors";
import { Button } from "@/shared/ui/button";
import type { DeviceSession } from "@/modules/authentication/domain/authentication.types";
import { deviceName } from "@/modules/authentication/domain/device-name";

/** Appareils connectés au compte, avec la déconnexion à distance (profil). */
export function SessionList({
  sessions,
  revoke,
  revokeOthers,
}: {
  sessions: DeviceSession[];
  revoke: (id: string) => Promise<string | undefined>;
  revokeOthers: () => Promise<string | undefined>;
}) {
  const t = useTranslations("auth.devices");
  const errors = useErrorMessages();
  const format = useFormatter();
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (call: () => Promise<string | undefined>) =>
    start(async () => {
      const code = await call();
      if (code) toast.error(errors(code));
      router.refresh();
    });
  const others = sessions.filter((s) => !s.current);
  const now = new Date();

  return (
    <section className="grid gap-3 rounded-xl border p-4">
      <h2 className="font-semibold">{t("title")}</h2>
      <ul className="grid gap-2">
        {sessions.map((s) => {
          const { browser, system } = deviceName(s.userAgent);
          const mobile = /Android|iPhone|iPad/.test(system ?? "");
          const Icon = mobile ? SmartphoneIcon : LaptopIcon;
          return (
            <li key={s.id} className="flex items-center gap-3">
              <Icon className="size-5 shrink-0 text-muted-foreground" />
              <div className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-medium">
                  {[browser, system].filter(Boolean).join(" · ") ||
                    t("unknown")}
                  {s.current && (
                    <span className="ms-2 text-xs font-normal text-primary">
                      {t("thisDevice")}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("lastUsed", {
                    when: format.relativeTime(new Date(s.lastUsedAt), now),
                  })}
                </span>
              </div>
              {!s.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => run(() => revoke(s.id))}
                >
                  {t("signOut")}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {others.length > 0 && (
        <Button
          variant="outline"
          className="justify-self-start"
          disabled={pending}
          onClick={() => run(revokeOthers)}
        >
          {t("signOutOthers")}
        </Button>
      )}
    </section>
  );
}
