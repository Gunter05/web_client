"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentAccount, searchProfiles } from "@/modules/auth/server";
import type { SearchResult } from "@/modules/pages";
import {
  submitPageRequest,
  grantAccess,
  getMembers,
  revokeAccess,
  withdrawPageRequest,
} from "@/modules/pages/server";
import { uploadImage } from "@/shared/api/client";
import {
  fileField,
  idField,
  textField,
  type FormState,
  parseForm,
} from "@/shared/lib/form";
import { checkImage } from "@/shared/lib/images";
import { apiErrorCode, catchApiError } from "@/shared/api/errors";

/** Demander la création d'une page (US-03) ; l'API prévient les admins. */
export async function requestPageAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await getCurrentAccount())) return { error: "loginRequired" };
  const f = parseForm(
    {
      name: textField(200),
      description: textField(2000),
      type: textField(50),
      justification: textField(2000),
      photo: fileField,
    },
    formData,
  );
  if (!f) return { error: "invalidInput" };
  const imageError = f.photo ? checkImage(f.photo) : null;
  if (imageError) {
    return { error: "invalidInput", fieldErrors: { photo: imageError } };
  }
  const { photo, ...form } = f;
  const result = await catchApiError(async () =>
    submitPageRequest({
      ...form,
      photoUrl: photo ? await uploadImage(photo) : null,
    }),
  );
  if (!result.ok) return result.state;
  redirect("/page-request?msg=sent");
}

export async function withdrawPageRequestAction(
  requestId: string,
): Promise<void> {
  const id = idField.safeParse(requestId);
  if (id.success) await apiErrorCode(() => withdrawPageRequest(id.data));
  revalidatePath("/page-request");
}

/**
 * US-06 : nom (3 caractères min) ou e-mail exact ; jamais d'e-mail en retour.
 * Les membres déjà présents sont signalés pour masquer « Donner l'accès ».
 */
export async function searchUsersAction(
  pageId: string,
  query: string,
): Promise<SearchResult> {
  const input = z
    .object({ pageId: idField, query: z.string().max(200) })
    .safeParse({ pageId, query });
  if (!input.success) return [];
  const result = await catchApiError(async () => {
    const [profiles, members] = await Promise.all([
      searchProfiles(input.data.query),
      getMembers(input.data.pageId),
    ]);
    const ids = new Set(members.map((m) => m.accountId));
    return profiles.map((p) => ({ ...p, member: ids.has(p.id) }));
  });
  return result.ok ? result.value : [];
}

const accessInput = z.object({ pageId: idField, accountId: idField });

export async function grantAccessAction(
  pageId: string,
  accountId: string,
): Promise<{ error?: string; name?: string }> {
  const input = accessInput.safeParse({ pageId, accountId });
  if (!input.success) return { error: "invalidInput" };
  const error = await apiErrorCode(() =>
    grantAccess(input.data.pageId, input.data.accountId),
  );
  revalidatePath("/my-pages", "layout");
  if (error) return { error };
  const members = await getMembers(input.data.pageId);
  return {
    name: members.find((m) => m.accountId === input.data.accountId)?.name ?? "",
  };
}

export async function revokeAccessAction(
  pageId: string,
  accountId: string,
): Promise<{ error?: string }> {
  const input = accessInput.safeParse({ pageId, accountId });
  if (!input.success) return { error: "invalidInput" };
  const error = await apiErrorCode(() =>
    revokeAccess(input.data.pageId, input.data.accountId),
  );
  revalidatePath("/my-pages", "layout");
  return error ? { error } : {};
}
