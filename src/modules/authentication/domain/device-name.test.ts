import { describe, expect, it } from "vitest";
import { deviceName } from "./device-name";

describe("deviceName", () => {
  it("reconnaît le navigateur et le système", () => {
    expect(
      deviceName(
        "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36",
      ),
    ).toEqual({ browser: "Chrome", system: "Android" });
    expect(
      deviceName(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
      ),
    ).toEqual({ browser: "Safari", system: "iPhone" });
  });

  it("ne devine rien sans navigateur déclaré", () => {
    expect(deviceName(null)).toEqual({ browser: null, system: null });
  });
});
