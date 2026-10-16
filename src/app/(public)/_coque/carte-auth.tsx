import type { ReactNode } from "react";
import { Logo } from "./logo";

export function CarteAuth({
  titre,
  sousTitre,
  pied,
  children,
}: {
  titre: string;
  sousTitre?: string;
  pied: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-sm gap-3 px-4 py-10">
      <div className="grid gap-6 rounded-xl border bg-card p-8">
        <div className="grid justify-items-center gap-3 text-center">
          <Logo />
          <h1 className="text-lg font-semibold">{titre}</h1>
          {sousTitre && (
            <p className="text-sm text-muted-foreground">{sousTitre}</p>
          )}
        </div>
        {children}
      </div>
      <p className="rounded-xl border bg-card p-4 text-center text-sm">
        {pied}
      </p>
    </div>
  );
}
