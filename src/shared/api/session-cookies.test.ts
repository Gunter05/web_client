import { describe, expect, it } from "vitest";
import { accessTokenNeedsRefresh } from "./session-cookies";

const token = (exp: number) =>
  `x.${btoa(JSON.stringify({ exp })).replace(/=+$/, "")}.y`;

describe("accessTokenNeedsRefresh", () => {
  const now = Date.parse("2026-10-23T10:00:00Z");

  it("renouvelle un jeton absent, illisible ou bientôt expiré", () => {
    expect(accessTokenNeedsRefresh(undefined, now)).toBe(true);
    expect(accessTokenNeedsRefresh("pas-un-jwt", now)).toBe(true);
    expect(accessTokenNeedsRefresh(token(now / 1000 + 10), now)).toBe(true);
  });

  it("garde un jeton encore valable", () => {
    expect(accessTokenNeedsRefresh(token(now / 1000 + 600), now)).toBe(false);
  });
});
