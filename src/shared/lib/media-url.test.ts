import { describe, expect, it } from "vitest";
import { mediaSrc } from "@/shared/lib/media-url";

const ID = "3f2a9c1e-5b7d-4e8a-9c21-7d4e5f6a8b90";

describe("mediaSrc", () => {
  it("lit une photo de l'API directement dans le bucket", () => {
    expect(mediaSrc(`/api/v1/medias/${ID}`, "https://medias.exemple.cm/")).toBe(
      `https://medias.exemple.cm/medias/${ID}`,
    );
  });

  it("garde l'adresse de l'API sans adresse publique du bucket", () => {
    expect(mediaSrc(`/api/v1/medias/${ID}`, "")).toBe(`/api/v1/medias/${ID}`);
  });

  it("laisse les autres adresses telles quelles", () => {
    const base = "https://medias.exemple.cm";
    expect(mediaSrc("https://images.unsplash.com/photo-1", base)).toBe(
      "https://images.unsplash.com/photo-1",
    );
    expect(mediaSrc("blob:http://localhost/abc", base)).toBe(
      "blob:http://localhost/abc",
    );
    expect(mediaSrc("/api/v1/medias/uploads", base)).toBe(
      "/api/v1/medias/uploads",
    );
  });
});
