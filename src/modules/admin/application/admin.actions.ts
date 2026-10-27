"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { deleteEvent, pinEvent, unpinEvent } from "@/modules/events/server";
import { acceptPageRequest, rejectPageRequest } from "@/modules/pages/server";
import { getCurrentAdmin } from "@/modules/admin/server";
import { campaignsAdmin } from "@/modules/campaigns/server";
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

// ——— Campagnes (ADR 0023 du backend) ———

const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null),
    z.string().max(max).nullable(),
  );

const campaignForm = {
  kind: z.enum(["SPONSORED", "ANNOUNCEMENT"]),
  sponsorType: z.enum(["PAGE", "ACCOUNT"]),
  sponsorId: textField(100),
  title: textField(80),
  body: optionalText(1000),
  posterUrl: optionalText(2048),
  bannerImageUrl: optionalText(2048),
  accentColor: optionalText(20),
  ctaLabel: textField(30),
  targetType: z.enum(["EVENT", "PAGE", "URL"]),
  targetEventId: optionalText(100),
  targetPageId: optionalText(100),
  targetUrl: optionalText(2048),
  placements: z.array(z.enum(["FEED_TOP", "FLOATING_BOTTOM"])),
  startsAt: textField(40),
  endsAt: textField(40),
  priority: z.coerce.number().int().min(0).max(100),
  dismissible: z.preprocess((v) => v === "on", z.boolean()),
};

/** Erreurs de validation du front, rangées sous les champs du formulaire. */
function campaignFieldErrors(
  issues: z.core.$ZodIssue[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    const field = key.startsWith("sponsor")
      ? "sponsor"
      : key.startsWith("target")
        ? "target"
        : key;
    errors[field] ??= issue.code === "too_big" ? "tooLong" : "required";
  }
  return errors;
}

/**
 * Création ou modification d'une campagne. L'API revérifie tout (rôle,
 * diffuseur, cible, images) et renvoie les erreurs par champ.
 */
export async function saveCampaignAction(
  campaignId: string | null,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = z
    .object(campaignForm)
    .safeParse(
      Object.fromEntries(
        Object.entries(campaignForm).map(([key, schema]) => [
          key,
          schema instanceof z.ZodArray
            ? formData.getAll(key)
            : (formData.get(key) ?? undefined),
        ]),
      ),
    );
  // Refus avant l'API : on dit quel champ, sinon le formulaire n'en montre aucun
  if (!parsed.success) {
    return {
      error: "invalidInput",
      fieldErrors: campaignFieldErrors(parsed.error.issues),
    };
  }
  const f = parsed.data;
  if (campaignId !== null && !idField.safeParse(campaignId).success) {
    return { error: "invalidInput" };
  }
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const input = {
    ...f,
    targetEventId: f.targetType === "EVENT" ? f.targetEventId : null,
    targetPageId: f.targetType === "PAGE" ? f.targetPageId : null,
    targetUrl: f.targetType === "URL" ? f.targetUrl : null,
  };
  const result = await catchApiError(() =>
    campaignId
      ? campaignsAdmin.update(campaignId, input)
      : campaignsAdmin.create(input),
  );
  if (!result.ok) return result.state;
  revalidatePath("/", "layout");
  redirect(`/admin/campaigns/${result.value.id}?msg=saved`);
}

/**
 * Suppression définitive d'une campagne : l'API vérifie le rôle et efface ses
 * compteurs, ses clics et ses images.
 */
export async function deleteCampaignAction(
  campaignId: string,
): Promise<{ error?: string }> {
  const id = idField.safeParse(campaignId);
  if (!id.success) return { error: "invalidInput" };
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const error = await apiErrorCode(() => campaignsAdmin.remove(id.data));
  revalidatePath("/", "layout");
  return error ? { error } : {};
}

/** Active, met en pause ou repasse en brouillon une campagne. */
export async function changeCampaignStatusAction(
  campaignId: string,
  status: "DRAFT" | "ACTIVE" | "PAUSED",
): Promise<{ error?: string }> {
  const input = z
    .object({ id: idField, status: z.enum(["DRAFT", "ACTIVE", "PAUSED"]) })
    .safeParse({ id: campaignId, status });
  if (!input.success) return { error: "invalidInput" };
  if (!(await getCurrentAdmin())) return { error: "accessDenied" };
  const error = await apiErrorCode(() =>
    campaignsAdmin.changeStatus(input.data.id, input.data.status),
  );
  revalidatePath("/", "layout");
  return error ? { error } : {};
}
