import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CarteEvenement } from "./carte-evenement";

describe("CarteEvenement", () => {
  it("affiche le titre, la date en français et le lieu", () => {
    render(
      <CarteEvenement
        evenement={{
          id: "1",
          titre: "Rencontre des développeurs",
          date: new Date("2026-11-07T18:30:00+01:00"),
          lieu: "Yaoundé",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Rencontre des développeurs" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/samedi 7 novembre 2026/)).toBeInTheDocument();
    expect(screen.getByText("Yaoundé")).toBeInTheDocument();
  });
});
