import { describe, expect, it } from "vitest";
import { mediaSrc } from "./media-src";

const id = "0f8fad5b-d9cb-469f-a165-70867728950e";

describe("mediaSrc", () => {
  it("lit une photo de l'API dans le stockage public", () => {
    expect(
      mediaSrc(`/api/v1/medias/${id}`, "https://medias.example.com/"),
    ).toBe(`https://medias.example.com/medias/${id}`);
  });

  it("garde l'adresse de l'API sans stockage public", () => {
    expect(mediaSrc(`/api/v1/medias/${id}`, "")).toBe(`/api/v1/medias/${id}`);
  });

  it("ne touche pas aux autres adresses", () => {
    const base = "https://medias.example.com";
    expect(mediaSrc("/campaigns/trophy.svg", base)).toBe(
      "/campaigns/trophy.svg",
    );
    expect(mediaSrc("blob:abc", base)).toBe("blob:abc");
    expect(mediaSrc("/api/v1/medias/../secret", base)).toBe(
      "/api/v1/medias/../secret",
    );
  });
});
