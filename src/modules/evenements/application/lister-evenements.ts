import { type Evenement, trierParDate } from "../domain/evenement";

export type SourceEvenements = () => Promise<Evenement[]>;

export async function listerEvenements(source: SourceEvenements) {
  return trierParDate(await source());
}
