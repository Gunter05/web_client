"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";

/**
 * Modal « illustré » de l'application : une illustration en tête, un grand
 * titre centré, une courte explication, le contenu (liste, choix…), puis les
 * actions en bas (secondaire à gauche, principale à droite). À réserver aux
 * moments qui méritent d'être mis en avant (choix, première fois…).
 */
export function IllustratedDialog({
  open = true,
  onOpenChange,
  illustration,
  title,
  description,
  children,
  actions,
}: {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  illustration: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto rounded-3xl p-8 sm:max-w-md"
      >
        <div className="mx-auto text-foreground" aria-hidden>
          {illustration}
        </div>
        <div className="grid gap-2 text-center">
          <DialogTitle className="text-2xl leading-tight font-bold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </div>
        {children}
        {actions && (
          <div className="flex flex-wrap justify-center gap-3">{actions}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
