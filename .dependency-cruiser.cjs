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
        "app/ n'importe un module que par son index.ts ou son server.ts.",
      severity: "error",
      from: { path: "^src/app/" },
      to: {
        path: "^src/modules/",
        pathNot: "^src/modules/[^/]+/(index|server)\\.ts$",
      },
    },
    {
      name: "module-vers-autre-module",
      comment: "Un module n'importe d'un autre module que son index.ts.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/" },
      to: {
        path: "^src/modules/",
        pathNot: ["^src/modules/$1/", "^src/modules/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "domaine-pur",
      comment:
        "domain/ ne dépend de rien d'autre que de son propre dossier (ni React, ni Next, ni bibliothèque).",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/domain/" },
      to: { pathNot: "^src/modules/$1/domain/" },
    },
    {
      name: "application-sans-ui-ni-infrastructure",
      comment: "application/ ne connaît que domain/.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/application/" },
      to: { path: "^src/modules/$1/(ui|infrastructure)/" },
    },
    {
      name: "shared-independant",
      comment: "shared/ ne dépend ni des modules ni de app/.",
      severity: "error",
      from: { path: "^src/shared/" },
      to: { path: "^src/(modules|app)/" },
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
