<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Règles du projet Le Contineng

- Lire le `README.md` (architecture, commandes) et les ADR de `docs/adr/` avant de modifier le code.
- `src/app/` ne fait que du routage. Le code métier vit dans `src/features/<feature>/` (`components/`, `actions/`, `api/`, `lib/`, `types/`) ; `app/` et `widgets/` n'utilisent une feature que par `index.ts`, `server.ts` ou `actions/`. `npm run arch` vérifie ces règles.
- Les composants shadcn/ui restent intacts dans `src/shared/components/ui/` ; les composants métier les assemblent dans `src/features/<feature>/components/`.
- Jamais `process.env` directement : importer `env` ou `clientEnv` depuis `src/shared/config/`.
- Toute Server Action valide ses entrées avec Zod et vérifie les droits.
- Lancer `npm run check` avant de proposer un changement.
