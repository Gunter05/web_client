import "server-only";
import { listerEvenements } from "./application/lister-evenements";
import { lireEvenementsDemo } from "./infrastructure/evenements-demo";

export async function listerLesEvenements() {
  "use cache";
  return listerEvenements(lireEvenementsDemo);
}
