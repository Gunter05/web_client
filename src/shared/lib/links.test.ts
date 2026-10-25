import { describe, expect, it } from "vitest";
import { splitLinks } from "@/shared/lib/links";

describe("splitLinks", () => {
  it("repère les adresses http(s) et www, ponctuation finale exclue", () => {
    expect(
      splitLinks(
        "Inscriptions : https://forms.gle/abc. Infos sur www.ecole.cm !",
      ),
    ).toEqual([
      { type: "text", text: "Inscriptions : " },
      {
        type: "link",
        text: "https://forms.gle/abc",
        href: "https://forms.gle/abc",
      },
      { type: "text", text: ". Infos sur " },
      { type: "link", text: "www.ecole.cm", href: "https://www.ecole.cm" },
      { type: "text", text: " !" },
    ]);
  });

  it("laisse un texte sans adresse tel quel", () => {
    expect(splitLinks("Rendez-vous au foyer.")).toEqual([
      { type: "text", text: "Rendez-vous au foyer." },
    ]);
  });

  it("garde le chemin et les paramètres, retire la parenthèse fermante", () => {
    expect(splitLinks("(voir https://site.cm/a?b=1&c=2)")[1]).toEqual({
      type: "link",
      text: "https://site.cm/a?b=1&c=2",
      href: "https://site.cm/a?b=1&c=2",
    });
  });
});
