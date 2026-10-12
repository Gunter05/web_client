import "server-only";
import { listerEvenements } from "./application/lister-evenements";
import { lireEvenementsDemo } from "./infrastructure/evenements-demo";

export function listerLesEvenements() {
  return listerEvenements(lireEvenementsDemo);
}
