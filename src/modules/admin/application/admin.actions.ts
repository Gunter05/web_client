"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { acceptPageRequest, rejectPageRequest } from "@/modules/pages/server";
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
