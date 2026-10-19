"use client";

import { BellIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { Notification } from "@/modules/notifications/domain/notification.types";

const INTERVAL_MS = 15_000;

export type NotificationActions = {
  count: () => Promise<number>;
  list: () => Promise<Notification[]>;
  markRead: () => Promise<void>;
};

/**
 * Cloche avec compteur de non-lues, mis à jour sans recharger la page (D8)
 * par interrogation régulière. Ouvrir la liste marque tout comme lu.
 */
export function NotificationBell({
  initialUnread,
  actions,
  label = false,
  labelClassName,
  className,
}: {
  initialUnread: number;
  actions: NotificationActions;
  label?: boolean;
  /** Classes du libellé, pour qu'une barre réduite puisse le masquer. */
  labelClassName?: string;
  className?: string;
}) {
  const t = useTranslations("notifications");
  const format = useFormatter();
  const [unread, setUnread] = useState(initialUnread);
  const [list, setList] = useState<Notification[] | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      if (document.visibilityState === "visible") {
        setUnread(await actions.count());
      }
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [actions]);

  async function open(isOpen: boolean) {
    if (!isOpen) return;
    setList(await actions.list());
    if (unread > 0) {
      await actions.markRead();
      setUnread(0);
    }
  }

  return (
    <Popover onOpenChange={open}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size={label ? "lg" : "icon-lg"}
            className={cn(
              label && "h-11 w-full justify-start gap-3 px-3 font-normal",
              className,
            )}
            aria-label={unread ? `${t("title")} (${unread})` : t("title")}
          />
        }
      >
        <span className="relative">
          <BellIcon className="size-6" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid min-w-4.5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
        {label && (
          <span className={cn("text-base", labelClassName)}>{t("title")}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <p className="border-b px-4 py-3 font-semibold">{t("title")}</p>
        <div className="max-h-96 overflow-y-auto">
          {list === null ? (
            <p className="p-4 text-sm text-muted-foreground">…</p>
          ) : list.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <ul className="divide-y">
              {list.map((n) => {
                const content = (
                  <>
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        !n.read && "bg-marque-2",
                      )}
                      aria-hidden
                    />
                    <span className="grid gap-0.5">
                      <span className="text-sm">{t(n.type, n.params)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format.relativeTime(new Date(n.createdAt))}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link
                        href={n.link}
                        className="flex gap-3 px-4 py-3 hover:bg-muted"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex gap-3 px-4 py-3">{content}</div>
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
