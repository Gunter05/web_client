import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("la page d'accueil liste les événements par date", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Événements à venir" }),
  ).toBeVisible();

  const titres = page.getByRole("heading", { level: 2 });
  await expect(titres).toHaveText([
    "Rencontre des développeurs",
    "Concert au parc",
  ]);
});

test("la page d'accueil n'a aucune violation d'accessibilité A/AA", async ({
  page,
}) => {
  await page.goto("/");

  const resultats = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(resultats.violations).toEqual([]);
});
