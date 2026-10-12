import { expect, test } from "@playwright/test";

test("la page HTML est servie avec les en-têtes de sécurité", async ({
  request,
}) => {
  const reponse = await request.get("/");
  const enTetes = reponse.headers();

  expect(enTetes["x-content-type-options"]).toBe("nosniff");
  expect(enTetes["x-frame-options"]).toBe("DENY");
  expect(enTetes["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(enTetes["permissions-policy"]).toContain("camera=()");
  expect(enTetes["content-security-policy-report-only"]).toContain(
    "default-src 'self'",
  );
  expect(enTetes["x-powered-by"]).toBeUndefined();
});

test("une adresse inconnue affiche la page 404 en français", async ({
  page,
}) => {
  const reponse = await page.goto("/cette-page-n-existe-pas");

  expect(reponse?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page introuvable" }),
  ).toBeVisible();
});
