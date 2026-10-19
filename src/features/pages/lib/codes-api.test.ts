import { describe, expect, it } from "vitest";
import {
  roleDepuisApi,
  statutDepuisApi,
  typeDepuisApi,
  typeVersApi,
} from "./codes-api";

describe("codes du module pages", () => {
  it("traduit les codes connus dans les deux sens", () => {
    expect(typeDepuisApi("studentUnion")).toBe("bde");
    expect(typeVersApi("service")).toBe("schoolService");
    expect(roleDepuisApi("owner")).toBe("proprietaire");
    expect(statutDepuisApi("withdrawn")).toBe("retiree");
  });

  it("retombe sur une valeur neutre pour un code inconnu", () => {
    expect(typeDepuisApi("secte")).toBe("autre");
    expect(roleDepuisApi("invite")).toBe("contributeur");
    expect(statutDepuisApi("archive")).toBe("en_attente");
    expect(typeVersApi("inconnu")).toBe("inconnu");
  });
});
