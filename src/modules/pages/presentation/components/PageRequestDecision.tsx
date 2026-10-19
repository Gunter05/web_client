"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { FormField } from "@/shared/components/FormField";
import { useFormAction } from "@/shared/hooks/useFormAction";
import { useErrorMessages } from "@/shared/i18n/errors";
import type { FormAction, FormState } from "@/shared/lib/form";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

/** Accepter, ou refuser avec un motif d'au moins 10 caractères (US-03). */
export function PageRequestDecision({
  requestId,
  accept,
  reject,
}: {
  requestId: string;
  accept: () => Promise<{ error?: string } | void>;
  reject: FormAction;
}) {
  const t = useTranslations();
  const errors = useErrorMessages();
  const [enCours, startTransition] = useTransition();
  const rejection = useFormAction<FormState>(reject, {});
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        disabled={enCours}
        onClick={() =>
          startTransition(async () => {
            const r = await accept();
            if (r?.error) toast.error(errors(r.error));
          })
        }
      >
        {t("admin.pageRequests.accept")}
      </Button>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          {t("admin.pageRequests.reject")}
        </DialogTrigger>
        <DialogContent>
          <form
            action={rejection.action}
            onSubmit={rejection.onSubmit}
            className="grid gap-4"
            noValidate
          >
            <DialogHeader>
              <DialogTitle>{t("admin.pageRequests.reject")}</DialogTitle>
            </DialogHeader>
            <input type="hidden" name="requestId" value={requestId} />
            <FormField
              id="reason"
              label={t("admin.pageRequests.rejectionReason")}
              error={errors(rejection.state.fieldErrors?.reason)}
            >
              <Textarea
                id="reason"
                name="reason"
                rows={3}
                aria-invalid={!!rejection.state.fieldErrors?.reason}
              />
            </FormField>
            {rejection.state.error && !rejection.state.fieldErrors && (
              <p role="alert" className="text-sm text-destructive">
                {errors(rejection.state.error)}
              </p>
            )}
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={rejection.enCours}
              >
                {t("admin.pageRequests.reject")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
