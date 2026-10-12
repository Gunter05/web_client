import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { Evenement } from "../domain/evenement";

const formatDate = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Africa/Douala",
});

export function CarteEvenement({ evenement }: { evenement: Evenement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{evenement.titre}</h2>
        </CardTitle>
        <CardDescription>
          <time dateTime={evenement.date.toISOString()}>
            {formatDate.format(evenement.date)}
          </time>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{evenement.lieu}</p>
      </CardContent>
    </Card>
  );
}
