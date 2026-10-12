import { CarteEvenement } from "@/modules/evenements";
import { listerLesEvenements } from "@/modules/evenements/server";

export default async function Accueil() {
  const evenements = await listerLesEvenements();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Événements à venir</h1>
      {evenements.map((evenement) => (
        <CarteEvenement key={evenement.id} evenement={evenement} />
      ))}
    </main>
  );
}
