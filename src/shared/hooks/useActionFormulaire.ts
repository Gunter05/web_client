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
export function useActionFormulaire<S extends object>(
  action: (etat: S, donnees: FormData) => Promise<S>,
  initial: S,
  preparer?: (donnees: FormData) => void,
) {
  const [etat, executer, enCours] = useActionState<S, FormData>(
    action,
    initial as Awaited<S>,
  );
  const [, demarrer] = useTransition();
  function onSubmit(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    preparer?.(donnees);
    demarrer(() => executer(donnees));
  }
  return { etat, onSubmit, enCours, action: executer };
}
