import { describe, expect, it } from "vitest";
import { internalPath } from "@/modules/authentication/domain/return-path";

describe("internalPath", () => {
  it("garde un chemin du site", () => {
    expect(internalPath("/e/42?x=1")).toBe("/e/42?x=1");
  });

  it("refuse une autre origine ou une valeur absente", () => {
    expect(internalPath("https://evil.example")).toBe("/");
    expect(internalPath("//evil.example")).toBe("/");
    expect(internalPath(null)).toBe("/");
    expect(internalPath(undefined)).toBe("/");
  });
});
