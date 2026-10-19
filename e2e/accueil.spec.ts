import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Interface en français (D2 : la langue suit le navigateur).
test.use({ locale: "fr-FR" });

test("un visiteur voit les événements à venir sans compte (US-01, US-16)", async ({
  page,
}) => {
  await page.goto("/");

  const cartes = page.getByRole("article");
  await expect(cartes.first()).toBeVisible();
  // Par défaut, seuls les événements en cours et à venir sont listés (D4).
  await expect(
    page.getByRole("heading", { level: 2, name: "Soirée de rentrée" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Période" })).toBeVisible();
});

test("le filtre Période = Passé est repris dans l'adresse (US-17)", async ({
  page,
}) => {
  await page.goto("/?periode=passe");

  await expect(
    page.getByRole("heading", { level: 2, name: "Soirée de rentrée" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Réinitialiser" }),
  ).toBeVisible();
});

test("la fiche s'ouvre sans compte et un lien inconnu est expliqué (US-36)", async ({
  page,
}) => {
  await page.goto("/e/gala26xx");
  await expect(
    page.getByRole("heading", { level: 1, name: "Soirée de gala" }),
  ).toBeVisible();
  await expect(page.getByText("Modifié").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Partager" })).toBeVisible();

  await page.goto("/e/inexistant");
  await expect(
    page.getByRole("heading", { name: "Cet événement n'existe pas" }),
  ).toBeVisible();
});

test("l'espace Administration demande une connexion (US-07)", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?retour=\/admin/);
});

test("la page d'accueil n'a aucune violation d'accessibilité A/AA", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("article").first()).toBeVisible();

  const resultats = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(resultats.violations).toEqual([]);
});
