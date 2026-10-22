import { describe, expect, it } from "vitest";
import { isKnownType } from "./notification.types";

describe("isKnownType", () => {
  it("reconnaît les codes de l'API, qui sont les clés du catalogue", () => {
    expect(isKnownType("requestRejected")).toBe(true);
  });

  it("écarte un type inconnu ou l'ancien code français", () => {
    expect(isKnownType("pageCreee")).toBe(false);
    expect(isKnownType("REQUEST_REJECTED")).toBe(false);
  });
});
