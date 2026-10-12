import type { Evenement } from "../domain/evenement";

const formatDate = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
});

export function CarteEvenement({ evenement }: { evenement: Evenement }) {
  return (
    <article className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{evenement.titre}</h2>
      <p>{formatDate.format(evenement.date)}</p>
      <p>{evenement.lieu}</p>
    </article>
  );
}
