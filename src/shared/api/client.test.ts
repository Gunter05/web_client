import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/config/env", () => ({ env: { API_URL: "http://api" } }));
vi.mock("@/shared/api/token", () => ({ readToken: async () => undefined }));

const { api, ApiError, translateApiError } = await import("./client");

function respond(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("client de l'API", () => {
  it("traduit les erreurs des modules encore en français", async () => {
    respond(400, {
      code: "formulaireInvalide",
      champs: { nom: "obligatoire", motDePasse: "motDePasseCourt" },
    });
    await expect(api("/api/v1/comptes")).rejects.toMatchObject({
      status: 400,
      code: "invalidInput",
      fieldErrors: { name: "required", password: "passwordTooShort" },
    });
  });

  it("garde les codes anglais et propose un code par défaut", async () => {
    respond(409, { code: "eventNotEditable" });
    await expect(api("/api/v1/events/x")).rejects.toMatchObject({
      code: "eventNotEditable",
    });
    respond(401, {});
    await expect(api("/api/v1/moi")).rejects.toMatchObject({
      code: "loginRequired",
    });
  });

  it("applique la table d'une feature aux codes et aux champs", () => {
    const traduite = translateApiError(
      new ApiError(400, "invalidInput", { photoUrl: "nameLength" }),
      { nameLength: "eventNameLength" },
      { photoUrl: "photo" },
    );
    expect(traduite).toMatchObject({
      code: "invalidInput",
      fieldErrors: { photo: "eventNameLength" },
    });
    const autre = new Error("réseau");
    expect(translateApiError(autre, {}, {})).toBe(autre);
  });
});
