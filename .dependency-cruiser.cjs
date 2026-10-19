/** @type {import('dependency-cruiser').IConfiguration} */
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
    {
      name: "app-par-points-d-entree",
      comment:
        "app/ (routage) n'importe une feature que par index.ts, server.ts ou ses Server Actions (actions/).",
      severity: "error",
      from: { path: "^src/app/" },
      to: {
        path: "^src/features/",
        pathNot: [
          "^src/features/[^/]+/(index|server)\\.ts$",
          "^src/features/[^/]+/actions/",
        ],
      },
    },
    {
      name: "widget-par-points-d-entree",
      comment:
        "Un widget compose des features par index.ts, server.ts ou leurs Server Actions.",
      severity: "error",
      from: { path: "^src/widgets/" },
      to: {
        path: "^src/features/",
        pathNot: [
          "^src/features/[^/]+/(index|server)\\.ts$",
          "^src/features/[^/]+/actions/",
        ],
      },
    },
    {
      name: "feature-vers-autre-feature",
      comment:
        "Une feature n'importe d'une autre feature que son index.ts ou son server.ts (jamais ses actions).",
      severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: {
        path: "^src/features/",
        pathNot: [
          "^src/features/$1/",
          "^src/features/[^/]+/(index|server)\\.ts$",
        ],
      },
    },
    {
      name: "features-sans-app-ni-widgets",
      comment: "Une feature ne connaît ni le routage ni les coques.",
      severity: "error",
      from: { path: "^src/features/" },
      to: { path: "^src/(app|widgets)/" },
    },
    {
      name: "lib-et-types-purs",
      comment:
        "lib/ et types/ d'une feature ne dépendent que de lib/ et types/ de la même feature (TypeScript pur, sans React ni Next).",
      severity: "error",
      from: { path: "^src/features/([^/]+)/(lib|types)/" },
      to: { pathNot: "^src/features/$1/(lib|types)/" },
    },
    {
      name: "shared-independant",
      comment: "shared/ ne dépend ni des features, ni des widgets, ni de app/.",
      severity: "error",
      from: { path: "^src/shared/" },
      to: { path: "^src/(features|widgets|app)/" },
    },
    {
      name: "admin-reserve-a-l-application-admin",
      comment:
        "La feature admin n'est utilisée que par l'application Administration.",
      severity: "error",
      from: {
        path: "^src/",
        pathNot: [
          "^src/app/admin/",
          "^src/widgets/admin-shell/",
          "^src/features/admin/",
        ],
      },
      to: { path: "^src/features/admin/" },
    },
    {
      name: "site-sans-admin",
      comment: "Le site n'importe rien de l'application Administration.",
      severity: "error",
      from: { path: "^src/(app/\\((site|auth)\\)|widgets/site-shell)/" },
      to: { path: "^src/(app/admin|widgets/admin-shell|features/admin)/" },
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
