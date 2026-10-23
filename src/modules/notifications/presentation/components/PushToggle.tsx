"use client";

import { BellOffIcon, BellRingIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  type PushActions,
  usePushNotifications,
} from "@/modules/notifications/presentation/hooks/usePushNotifications";

/**
 * Activation des notifications push sur cet appareil (profil). La permission
 * n'est demandée qu'au clic, jamais à l'arrivée sur le site.
 */
export function PushToggle({ actions }: { actions: PushActions }) {
  const t = useTranslations("notifications.push");
  const { state, enable, disable } = usePushNotifications(actions);

  return (
    <section className="grid gap-3 rounded-xl border p-4">
      <div className="flex items-start gap-3">
        {state === "on" ? (
          <BellRingIcon className="mt-0.5 size-5 shrink-0" />
        ) : (
          <BellOffIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        )}
        <div className="grid gap-1">
          <h2 className="font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t(state === "loading" ? "off" : state)}
          </p>
        </div>
      </div>
      {(state === "off" || state === "on") && (
        <Button
          variant={state === "on" ? "outline" : "default"}
          className="justify-self-start"
          onClick={() => void (state === "on" ? disable() : enable())}
        >
          {t(state === "on" ? "disable" : "enable")}
        </Button>
      )}
    </section>
  );
}
