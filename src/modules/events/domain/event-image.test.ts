import { describe, expect, it } from "vitest";
import { eventImage, PUBLIC_IMAGE_HOST } from "./event-image";

describe("eventImage", () => {
  it("garde la photo de l'événement quand elle existe", () => {
    expect(
      eventImage({ id: "a1", photoUrl: "/api/v1/medias/x", categories: [] }),
    ).toBe("/api/v1/medias/x");
  });

  it("donne une photo publique sinon, stable pour un même événement", () => {
    const event = { id: "a1", photoUrl: null, categories: ["party" as const] };
    const image = eventImage(event);
    expect(image.startsWith(PUBLIC_IMAGE_HOST)).toBe(true);
    expect(eventImage(event)).toBe(image);
  });

  it("demande la photo publique au format portrait 4:5", () => {
    const image = eventImage({ id: "c3", photoUrl: null, categories: [] });
    expect(image).toContain("w=1080&h=1350");
  });

  it("utilise « Autre » sans catégorie", () => {
    expect(
      eventImage({ id: "b2", photoUrl: null, categories: [] }).startsWith(
        PUBLIC_IMAGE_HOST,
      ),
    ).toBe(true);
  });
});
