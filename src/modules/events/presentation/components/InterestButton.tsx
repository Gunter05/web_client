"use client";

import { useFormatter, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { FireIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/utils";
import { setInterestAction } from "@/modules/events/application/interest.actions";
import type { EventView } from "@/modules/events/domain/event-view.types";

type State = { interested: boolean; count: number };

/**
 * « Intéressé » (ADR 0022 du backend) : la flamme et le nombre d'intéressés.
 * La réponse est immédiate (mise à jour optimiste), puis corrigée par celle de
 * l'API ; un refus rétablit l'état précédent. Sans compte, on passe par la
 * connexion.
 */
export function InterestButton({
  event,
  className,
}: {
  event: Pick<EventView, "id" | "interestCount" | "viewer">;
  className?: string;
}) {
  const t = useTranslations();
  const errors = useTranslations("errors");
  const format = useFormatter();
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>({
    interested: event.viewer?.interested ?? false,
    count: event.interestCount ?? 0,
  });
  const [shown, show] = useOptimistic(state);
  const count = format.number(shown.count, { notation: "compact" });

  function toggle() {
    if (!event.viewer) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    const interested = !shown.interested;
    startTransition(async () => {
      show({
        interested,
        count: Math.max(0, shown.count + (interested ? 1 : -1)),
      });
      const result = await setInterestAction(event.id, interested);
      if (result.ok) {
        setState({
          interested: result.value.interested,
          count: result.value.interestCount,
        });
      } else {
        const code = result.error as "unknown";
        toast.error(errors.has(code) ? errors(code) : errors("unknown"));
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={shown.interested}
      aria-label={`${t("events.interest")} (${count})`}
      title={t("events.interest")}
      onClick={toggle}
      className={cn(
        "flex h-10 items-center gap-1 rounded-full px-2 text-sm font-semibold tabular-nums transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6 [&_svg]:transition-transform active:[&_svg]:scale-90",
        shown.interested && "text-brand",
        className,
      )}
    >
      <FireIcon
        weight={shown.interested ? "fill" : "regular"}
        className={cn(shown.interested && "motion-safe:animate-rise")}
      />
      {count}
    </button>
  );
}
