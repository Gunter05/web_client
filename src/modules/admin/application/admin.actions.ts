"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { deleteEvent, pinEvent, unpinEvent } from "@/modules/events/server";
import { acceptPageRequest, rejectPageRequest } from "@/modules/pages/server";
import { getCurrentAdmin } from "@/modules/admin/server";
import {
  idField,
  textField,
  type FormState,
  parseForm,
} from "@/shared/lib/form";
import { apiErrorCode, catchApiError } from "@/shared/api/errors";

/** Le rôle admin est vérifié par l'API pour chaque décision (US-03). */
export async function acceptPageRequestAction(
  requestId: string,
): Promise<{ error?: string }> {
  const id = idField.safeParse(requestId);
  if (!id.success) return { error: "invalidInput" };
  const error = await apiErrorCode(() => acceptPageRequest(id.data));
  if (error) return { error };
  revalidatePath("/", "layout");
  redirect("/admin/page-requests?msg=accepted");
}

export async function rejectPageRequestAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const f = parseForm(
    { requestId: idField, reason: textField(1000) },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const result = await catchApiError(() =>
    rejectPageRequest(f.requestId, f.reason),
  );
  if (!result.ok) return result.state;
  revalidatePath("/", "layout");
  redirect("/admin/page-requests?msg=rejected");
}

/**
 * Épingle un événement en tête du fil pour quelques jours (ADR 0020 du
 * backend). Non visible des visiteurs ; 2 épinglés au plus.
 */
export async function pinEventAction(
  eventId: string,
  days: number,
): Promise<{ error?: string }> {
  const input = z
    .object({
      eventId: idField,
      days: z.number().int().min(1).max(30),
    })
    .safeParse({ eventId, days });
  if (!input.success) return { error: "invalidInput" };
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const until = new Date(Date.now() + input.data.days * 86_400_000);
  const error = await apiErrorCode(() =>
    pinEvent(input.data.eventId, until.toISOString()),
  );
  revalidatePath("/", "layout");
  return error ? { error } : {};
}

export async function unpinEventAction(
  eventId: string,
): Promise<{ error?: string }> {
  const id = idField.safeParse(eventId);
  if (!id.success) return { error: "invalidInput" };
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const error = await apiErrorCode(() => unpinEvent(id.data));
  revalidatePath("/", "layout");
  return error ? { error } : {};
}

/**
 * Suppression définitive d'un événement (ADR 0021 du backend) : l'API vérifie
 * aussi le rôle admin et supprime ses données et sa photo.
 */
export async function deleteEventAction(
  eventId: string,
): Promise<{ error?: string }> {
  const id = idField.safeParse(eventId);
  if (!id.success) return { error: "invalidInput" };
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const error = await apiErrorCode(() => deleteEvent(id.data));
  revalidatePath("/", "layout");
  return error ? { error } : {};
}
