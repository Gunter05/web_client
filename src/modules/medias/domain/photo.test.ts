import { describe, expect, it } from "vitest";
import { checkPhoto, fitWithin, isMediaUrl, MAX_PHOTO_SIZE } from "./photo";

describe("checkPhoto", () => {
  it("accepte JPEG, PNG et WebP jusqu'à 5 Mo", () => {
    expect(checkPhoto({ type: "image/webp", size: 1000 })).toBeNull();
    expect(checkPhoto({ type: "image/png", size: MAX_PHOTO_SIZE })).toBeNull();
  });

  it("refuse les autres formats, un fichier vide ou trop lourd", () => {
    expect(checkPhoto({ type: "image/svg+xml", size: 10 })).toBe(
      "invalidPhoto",
    );
    expect(checkPhoto({ type: "image/png", size: 0 })).toBe("photoTooLarge");
    expect(checkPhoto({ type: "image/png", size: MAX_PHOTO_SIZE + 1 })).toBe(
      "photoTooLarge",
    );
  });
});

describe("fitWithin", () => {
  it("réduit une grande photo en gardant ses proportions", () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1080, height: 810 });
    expect(fitWithin(3000, 6000)).toEqual({ width: 675, height: 1350 });
  });

  it("n'agrandit jamais une petite photo", () => {
    expect(fitWithin(640, 480)).toEqual({ width: 640, height: 480 });
  });
});

describe("isMediaUrl", () => {
  it("n'accepte que l'adresse d'un média de l'API", () => {
    expect(
      isMediaUrl("/api/v1/medias/0f8fad5b-d9cb-469f-a165-70867728950e"),
    ).toBe(true);
    expect(isMediaUrl("https://exemple.com/photo.jpg")).toBe(false);
    expect(isMediaUrl("/api/v1/medias/../secret")).toBe(false);
  });
});
