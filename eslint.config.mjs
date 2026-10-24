import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Icônes : Phosphor, via src/shared/components/icons (réglages communs).
  // Seuls les composants shadcn/ui, laissés intacts, gardent Lucide.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/shared/ui/**", "src/shared/components/icons.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message: "Importer les icônes depuis @/shared/components/icons.",
            },
            {
              name: "@phosphor-icons/react",
              message: "Importer les icônes depuis @/shared/components/icons.",
            },
            {
              name: "@phosphor-icons/react/ssr",
              message: "Importer les icônes depuis @/shared/components/icons.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Rapports générés par les tests :
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    // Copies de travail créées par Claude Code :
    ".claude/**",
  ]),
]);

export default eslintConfig;
