import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://localhost:${port}`;
// API factice (e2e/api-factice) : la CI n'a ni base de données ni API Spring.
const portApi = 8089;
const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/api-factice/serveur.mjs",
      url: `http://localhost:${portApi}/actuator/health`,
      env: { PORT: String(portApi) },
      reuseExistingServer: !ci,
    },
    {
      // En CI, le build est fait avant : on sert la version de production.
      command: ci ? "npm run start" : `npm run dev -- -p ${port}`,
      url: baseURL,
      env: { API_URL: `http://localhost:${portApi}` },
      reuseExistingServer: !ci,
      timeout: 120_000,
    },
  ],
});
