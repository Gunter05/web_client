import "server-only";
import { collection } from "@/shared/stockage/collection-json";
import type { Mesure } from "../domain/mesure";

const journal = collection<Mesure>("mesures", () => []);

/** Simule un service d'analytics (ADR 0011) : journal local de chaque action suivie. */
export function envoyer(mesure: Mesure): void {
  journal.muter((l) => [...l, mesure]);
}
