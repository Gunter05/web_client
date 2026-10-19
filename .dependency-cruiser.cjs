/** @type {import('dependency-cruiser').IConfiguration} */

// Points d'entrée publics d'un module : index.ts, server.ts et ses Server Actions.
const MODULE_ENTRIES = [
  "^src/modules/[^/]+/(index|server)\\.ts$",
  "^src/modules/[^/]+/application/",
];

module.exports = {
  forbidden: [
    {
      name: "pas-de-cycle",
      comment:
        "Deux fichiers ne doivent pas dépendre l'un de l'autre, même indirectement.",
      severity: "error",
      from: {},
      to: { circular: true },
    },

    // --- Routage (app/) ---
    {
      name: "app-vers-modules-par-points-d-entree",
      comment:
        "app/ n'importe un module que par index.ts, server.ts ou ses Server Actions (application/).",
      severity: "error",
      from: { path: "^src/app/" },
      to: { path: "^src/modules/", pathNot: MODULE_ENTRIES },
    },
    {
      name: "app-vers-espaces-par-index",
      comment: "app/ n'importe un espace que par son index.ts.",
      severity: "error",
      from: { path: "^src/app/" },
      to: { path: "^src/spaces/", pathNot: "^src/spaces/[^/]+/index\\.ts$" },
    },

    // --- Espaces (spaces/) ---
    {
      name: "espace-vers-modules-par-points-d-entree",
      comment:
        "Un espace compose des modules par index.ts, server.ts ou leurs Server Actions.",
      severity: "error",
      from: { path: "^src/spaces/" },
      to: { path: "^src/modules/", pathNot: MODULE_ENTRIES },
    },
    {
      name: "espaces-independants",
      comment: "Les espaces Super-Admin et utilisateur ne se connaissent pas.",
      severity: "error",
      from: { path: "^src/spaces/([^/]+)/" },
      to: { path: "^src/spaces/", pathNot: "^src/spaces/$1/" },
    },
    {
      name: "espaces-sans-app",
      comment: "Un espace ne connaît pas le routage.",
      severity: "error",
      from: { path: "^src/spaces/" },
      to: { path: "^src/app/" },
    },

    // --- Modules métier (modules/) ---
    {
      name: "module-vers-autre-module",
      comment:
        "Un module n'importe d'un autre module que son index.ts ou son server.ts (jamais ses actions).",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/" },
      to: {
        path: "^src/modules/",
        pathNot: [
          "^src/modules/$1/",
          "^src/modules/[^/]+/(index|server)\\.ts$",
        ],
      },
    },
    {
      name: "modules-sans-app-ni-espaces",
      comment: "Un module ne connaît ni le routage ni les espaces.",
      severity: "error",
      from: { path: "^src/modules/" },
      to: { path: "^src/(app|spaces)/" },
    },
    {
      name: "domaine-pur",
      comment:
        "domain/ ne dépend que de domain/ du même module (TypeScript pur : ni React, ni Next, ni HTTP).",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/domain/" },
      to: { pathNot: "^src/modules/$1/domain/" },
    },
    {
      name: "infrastructure-sans-application-ni-presentation",
      comment:
        "infrastructure/ (appels API, adaptation du contrat) ne dépend ni des cas d'utilisation ni de l'interface.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/infrastructure/" },
      to: { path: "^src/modules/$1/(application|presentation)/" },
    },
    {
      name: "application-sans-presentation",
      comment: "application/ (Server Actions) ne dépend pas de l'interface.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/application/" },
      to: { path: "^src/modules/$1/presentation/" },
    },
    {
      name: "presentation-sans-infrastructure",
      comment:
        "presentation/ ne parle pas directement à l'API : elle passe par application/ ou server.ts.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/presentation/" },
      to: { path: "^src/modules/$1/infrastructure/" },
    },

    // --- Partagé (shared/) ---
    {
      name: "shared-independant",
      comment: "shared/ ne dépend ni des modules, ni des espaces, ni de app/.",
      severity: "error",
      from: { path: "^src/shared/" },
      to: { path: "^src/(modules|spaces|app)/" },
    },
    {
      name: "ui-primitive",
      comment:
        "shared/ui (shadcn/ui) ne dépend pas des composants applicatifs de shared/components.",
      severity: "error",
      from: { path: "^src/shared/ui/" },
      to: { path: "^src/shared/components/" },
    },

    // --- Séparation Super-Admin / utilisateur ---
    {
      name: "admin-reserve-au-super-admin",
      comment:
        "Le module admin n'est utilisé que par l'espace Super-Admin et ses routes.",
      severity: "error",
      from: {
        path: "^src/",
        pathNot: [
          "^src/app/\\(super-admin\\)/",
          "^src/spaces/super-admin/",
          "^src/modules/admin/",
        ],
      },
      to: { path: "^src/modules/admin/" },
    },
    {
      name: "espace-utilisateur-sans-admin",
      comment:
        "Les routes utilisateur et d'authentification n'importent rien du Super-Admin.",
      severity: "error",
      from: { path: "^src/(app/\\((user|auth)\\)|spaces/user)/" },
      to: {
        path: "^src/(app/\\(super-admin\\)|spaces/super-admin|modules/admin)/",
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    // Les tests ont le droit d'importer Vitest et Testing Library.
    exclude: { path: ["^\\.next/", "\\.test\\.tsx?$"] },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
  },
};
