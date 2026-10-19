"use client";

import { type FormEvent, useActionState, useTransition } from "react";

/**
 * Lance une Server Action sans réinitialiser le formulaire : les valeurs
 * saisies sont conservées en cas d'erreur (US-11). `preparer` ajuste les
 * données avant envoi (ex. heure locale → UTC).
 *
 * `action` est aussi branchée sur le formulaire : avant l'hydratation, il
 * reste envoyé en POST à la Server Action (jamais en GET, qui exposerait
 * les champs, mot de passe compris, dans l'adresse).
 */
export function useFormAction<S extends object>(
  action: (state: S, formData: FormData) => Promise<S>,
  initial: S,
  prepared?: (formData: FormData) => void,
) {
  const [state, run, enCours] = useActionState<S, FormData>(
    action,
    initial as Awaited<S>,
  );
  const [, startTransition] = useTransition();
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    prepared?.(formData);
    startTransition(() => run(formData));
  }
  return { state, onSubmit, enCours, action: run };
}
