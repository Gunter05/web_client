"use server";

import { z } from "zod";
import type { InterestState } from "@/modules/events/domain/event-view.types";
import { setInterest } from "@/modules/events/server";
import { getCurrentUser } from "@/modules/pages/server";
import { catchApiError } from "@/shared/api/errors";
import { idField } from "@/shared/lib/form";

const interestSchema = z.object({ id: idField, interested: z.boolean() });

/**
 * « Intéressé » (ADR 0022 du backend), pour tout compte connecté. Renvoie le
 * nouvel état et le compteur, ou le code d'erreur à afficher.
 */
export async function setInterestAction(
  id: string,
  interested: boolean,
): Promise<{ ok: true; value: InterestState } | { ok: false; error: string }> {
  const f = interestSchema.safeParse({ id, interested });
  if (!f.success) return { ok: false, error: "invalidInput" };
  if (!(await getCurrentUser())) return { ok: false, error: "loginRequired" };
  const result = await catchApiError(() =>
    setInterest(f.data.id, f.data.interested),
  );
  if (!result.ok) return { ok: false, error: result.state.error ?? "unknown" };
  return { ok: true, value: result.value };
}
