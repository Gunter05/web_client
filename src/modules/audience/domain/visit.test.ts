import { describe, expect, it } from "vitest";
import { visitKey } from "@/modules/audience/domain/visit";

describe("visitKey", () => {
  it("change chaque jour (UTC) et selon le mode", () => {
    const morning = new Date("2026-10-24T06:00:00Z");
    const evening = new Date("2026-10-24T22:00:00Z");
    expect(visitKey(morning, false)).toBe(visitKey(evening, false));
    expect(visitKey(morning, true)).not.toBe(visitKey(morning, false));
    expect(visitKey(new Date("2026-10-25T00:30:00Z"), false)).toBe(
      "2026-10-25:web",
    );
  });
});
