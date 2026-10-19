import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/shared/i18n/messages/fr.json";
import type { EvenementAffiche } from "../domain/affichage";
import { CarteEvenement } from "./carte-evenement";

const evenement: EvenementAffiche = {
  id: "gala26xx",
  pageId: "bde",
  nom: "Soirée de gala",
  debut: "2026-11-07T18:30:00Z",
  fin: null,
  lieu: "Salle des fêtes",
  categories: ["soiree"],
  description: null,
  photo: null,
  statut: "annule",
  derniereModification: null,
  annulation: { motif: "Salle indisponible", le: "2026-11-01T10:00:00Z" },
  creeLe: "2026-10-01T10:00:00Z",
  periode: "a_venir",
  page: { id: "bde", nom: "BDE", slug: "bde", photo: null },
};

function afficher(e: EvenementAffiche) {
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <CarteEvenement evenement={e} />
    </NextIntlClientProvider>,
  );
}

describe("CarteEvenement (US-01)", () => {
  it("affiche le nom, le lieu, la page, les catégories et un lien vers la fiche", () => {
    afficher({ ...evenement, statut: "publie", annulation: null });
    expect(
      screen.getByRole("heading", { name: "Soirée de gala" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Salle des fêtes")).toBeInTheDocument();
    expect(screen.getByText("BDE")).toBeInTheDocument();
    expect(screen.getByText("#Soirée/fête")).toBeInTheDocument();
    for (const lien of screen.getAllByRole("link", {
      name: "Soirée de gala",
    })) {
      expect(lien).toHaveAttribute("href", "/e/gala26xx");
    }
    expect(
      screen.getByRole("button", { name: "Partager" }),
    ).toBeInTheDocument();
  });

  it("signale l'annulation par un texte, pas seulement une couleur (US-15)", () => {
    afficher(evenement);
    expect(screen.getAllByText("Annulé").length).toBeGreaterThan(0);
  });
});
