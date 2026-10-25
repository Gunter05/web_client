"use client";

import type { ReactNode } from "react";
import { DotsThreeIcon } from "@/shared/components/icons";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

const TRIGGER =
  "grid size-10 shrink-0 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-6";

/**
 * Bouton « ··· » qui regroupe des actions, comme sous une publication de
 * réseau social : un sheet qui monte du bas sur téléphone, un petit panneau
 * ancré au bouton sur ordinateur. Les actions s'empilent, sur toute la largeur.
 */
export function MoreActions({
  label,
  triggerClassName,
  children,
}: {
  /** Nom du bouton et titre du panneau (« Plus d'actions »). */
  label: string;
  /** Style du bouton « ··· » (sur une image, par exemple). */
  triggerClassName?: string;
  children: ReactNode;
}) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const list = (
    <div className="grid gap-2 *:w-full *:justify-start">{children}</div>
  );
  if (desktop) {
    return (
      <Popover>
        <PopoverTrigger
          aria-label={label}
          title={label}
          className={cn(TRIGGER, triggerClassName)}
        >
          <DotsThreeIcon weight="bold" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <PopoverTitle className="sr-only">{label}</PopoverTitle>
          {list}
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Sheet>
      <SheetTrigger
        aria-label={label}
        title={label}
        className={cn(TRIGGER, triggerClassName)}
      >
        <DotsThreeIcon weight="bold" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-3 rounded-t-2xl px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {/* Poignée du sheet */}
        <div
          aria-hidden
          className="mx-auto h-1 w-10 rounded-full bg-muted-foreground/30"
        />
        <SheetTitle className="text-center text-sm text-muted-foreground">
          {label}
        </SheetTitle>
        {list}
      </SheetContent>
    </Sheet>
  );
}
