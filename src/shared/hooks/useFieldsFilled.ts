"use client";

import { type FormEvent, useState } from "react";

/**
 * Vrai quand tous les champs visibles du formulaire sont remplis : le bouton
 * d'envoi reste désactivé jusque-là. Brancher `onInput` sur le <form>.
 */
export function useFieldsFilled() {
  const [filled, setFilled] = useState(false);
  function onInput(event: FormEvent<HTMLFormElement>) {
    const fields = event.currentTarget.querySelectorAll<HTMLInputElement>(
      "input:not([type=hidden]), textarea",
    );
    setFilled([...fields].every((field) => field.value.trim() !== ""));
  }
  return { filled, onInput };
}
