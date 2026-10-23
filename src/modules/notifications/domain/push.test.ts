import { describe, expect, it } from "vitest";
import {
  firebaseWebConfig,
  INSTALLATION_ID,
  serviceWorkerScript,
} from "./push";

const config = {
  apiKey: "AIza-test",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
};

describe("firebaseWebConfig", () => {
  it("désactive les push si une valeur manque", () => {
    expect(firebaseWebConfig({ ...config, vapidKey: "" })).toBeNull();
    expect(
      firebaseWebConfig({ ...config, appId: "", vapidKey: "BKey" }),
    ).toBeNull();
  });

  it("sépare la clé VAPID de la configuration", () => {
    expect(firebaseWebConfig({ ...config, vapidKey: "BKey" })).toEqual({
      config,
      vapidKey: "BKey",
    });
  });
});

describe("serviceWorkerScript", () => {
  it("charge le SDK de la version installée et le projet", () => {
    const script = serviceWorkerScript(config, "13.1.0");
    expect(script).toContain("firebasejs/13.1.0/firebase-messaging-compat.js");
    expect(script).toContain('"projectId":"demo"');
  });
});

describe("INSTALLATION_ID", () => {
  it("accepte un FID et refuse un chemin", () => {
    expect(INSTALLATION_ID.test("cKs1d_Tx8a1-Qm9vZ3pLrA")).toBe(true);
    expect(INSTALLATION_ID.test("../admin")).toBe(false);
  });
});
