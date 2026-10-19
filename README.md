# Le Contineng — client web

Le réseau social centré sur les événements. Ce dépôt contient le site web, construit avec Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS v4.

Production : https://le-contineng.vercel.app

## Démarrer en moins de 10 minutes

**Prérequis :** Node.js 24 (le fichier `.nvmrc` le précise) et git.

```bash
git clone git@github.com:Le-contineng/web_client.git
cd web_client
nvm use                       # passe à Node 24 si tu utilises nvm
npm ci                        # installe les dépendances exactes du lockfile
cp .env.example .env.local    # puis adapte les valeurs si besoin
npm run dev                   # http://localhost:3000
```

`npm ci` échoue volontairement si la version de Node n'est pas la 24 (`engine-strict` dans `.npmrc`).

## Commandes

| Commande                | Rôle                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm run dev`           | Serveur de développement, recompile à chaque sauvegarde                  |
| `npm run build`         | Build de production (le même que Vercel)                                 |
| `npm run start`         | Sert le build de production                                              |
| `npm run check`         | **À lancer avant de pousser** : format, lint, types, architecture, tests |
| `npm run format`        | Formate tout le projet avec Prettier                                     |
| `npm run lint`          | ESLint                                                                   |
| `npm run typecheck`     | Vérifie les types TypeScript                                             |
| `npm run arch`          | Vérifie les règles d'architecture (dependency-cruiser)                   |
| `npm run test`          | Tests unitaires et de composants (Vitest)                                |
| `npm run test:coverage` | Tests unitaires avec seuil de couverture                                 |
| `npm run test:e2e`      | Tests de bout en bout et d'accessibilité (Playwright + axe)              |

Avant le premier `npm run test:e2e`, installe le navigateur de test : `npx playwright install chromium`.

Les hooks Git (Husky) tournent tout seuls : avant chaque commit, `lint-staged` formate et corrige les fichiers modifiés ; avant chaque push, `typecheck` et `arch` sont lancés.

## Variables d'environnement

Elles sont décrites et validées par Zod dans `src/shared/config/schema.ts`. Une variable manquante fait échouer le build en la nommant.

| Variable               | Côté    | Obligatoire | Rôle                        |
| ---------------------- | ------- | ----------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | public  | oui         | Adresse publique du site    |
| `API_URL`              | serveur | non         | URL de l'API (défaut :8080) |
| `FUSEAU_APERCU`        | serveur | non         | Fuseau de l'aperçu WhatsApp |

- En local : `.env.local` (jamais commité).
- En CI : bloc `env` de `.github/workflows/ci.yml`.
- Sur Vercel : _Settings > Environment Variables_.

Les variables `NEXT_PUBLIC_*` sont recopiées dans le code au moment du build : pas de secret dedans, et changer leur valeur demande un nouveau build. Dans le code, on n'utilise jamais `process.env` directement : on importe `env` (serveur, `@/shared/config/env`) ou `clientEnv` (`@/shared/config/env.client`).

## Architecture

Organisation par feature ([ADR 0014](docs/adr/0014-architecture-par-features.md)). Deux applications partagent le même code : le **site** (visiteurs et membres) et l'**Administration**.

```
src/
├── app/                      Routage Next.js uniquement
│   ├── (auth)/                   /login, /register (page épurée)
│   ├── (site)/                   Le site : /, /search, /e/{id}, /e/{id}/edit, /events/new,
│   │                             /p/{slug}, /my-pages…, /page-request, /profile
│   ├── admin/                    L'application Administration : /admin/page-requests,
│   │                             /admin/accounts, /admin/pages, /admin/events
│   ├── layout.tsx, providers.tsx Document racine et providers globaux (i18n, toasts)
│   └── demo/[nom]/route.ts       Images de démonstration
├── features/                 Cœur de l'application, une feature par domaine
│   ├── auth/                     Compte, connexion, inscription, profil
│   ├── events/                   Événements : fil, fiche, filtres, publication
│   ├── pages/                    Pages, demandes de page, « Mes pages », accès
│   ├── audience/                 Vues uniques par jour (US-39)
│   ├── notifications/            Cloche et notifications
│   ├── metrics/                  Métriques produit (partages)
│   └── admin/                    Supervision (réservée à l'application Administration)
│       ├── components/               Composants React de la feature
│       ├── actions/                  Server Actions (Zod, droits, orchestration)
│       ├── api/                      Appels à l'API Spring et traduction du contrat
│       ├── lib/                      Règles pures (TypeScript sans React ni Next), testées
│       ├── types/                    Types de la feature
│       ├── index.ts                  API publique utilisable partout (composants, types, règles)
│       └── server.ts                 API publique côté serveur (données), protégée par server-only
├── widgets/                  Compositions de features
│   ├── site-shell/               Coque du site : barre latérale, en-tête, navigation basse
│   └── admin-shell/              Coque de l'Administration : en-tête, onglets, garde
└── shared/                   Code partagé, sans métier
    ├── components/               Composants génériques (avatar, champ, langue…)
    │   ├── ui/                       Composants shadcn/ui
    │   └── layout/                   Logo, en-tête de page, squelettes
    ├── api/                      Client HTTP de l'API, jeton de session, erreurs
    ├── config/                   Variables d'environnement validées
    ├── i18n/                     Catalogues FR/EN, formats de date, langue (ADR 0009)
    ├── hooks/                    Hooks transverses
    └── lib/                      Utilitaires purs
```

Règles vérifiées par `npm run arch` (dependency-cruiser) :

- `app/` et `widgets/` n'utilisent une feature que par `index.ts`, `server.ts` ou ses Server Actions (`actions/`) ;
- une feature n'utilise une autre feature que par `index.ts` ou `server.ts`, et ne connaît ni `app/` ni `widgets/` ;
- `lib/` et `types/` restent purs ; `shared/` ne dépend de rien d'autre ;
- la feature `admin` n'est utilisée que par l'application Administration, et le site n'importe rien de l'Administration.

Les anciennes adresses françaises (`/connexion`, `/mes-pages`, `/admin/demandes`…) redirigent vers les nouvelles (`next.config.ts`).

### Démonstration

Les données de démo sont chargées par l'API lancée avec le profil `local` (`./mvnw spring-boot:run -Dspring-boot.run.profiles=local`). Mot de passe commun : `demo1234`.

| E-mail                 | Rôle                                            |
| ---------------------- | ----------------------------------------------- |
| `awa@contineng.test`   | Propriétaire de BDE et Les Planches             |
| `karim@contineng.test` | Propriétaire de Club Foot, contributeur BDE     |
| `lina@contineng.test`  | Utilisatrice sans page (une demande en attente) |
| `admin@contineng.test` | Admin (`/admin`)                                |

Les règles sont vérifiées par `npm run arch` en CI (`.dependency-cruiser.cjs`) :

1. Pas de dépendance circulaire.
2. `app/` n'importe un module que par son `index.ts` ou son `server.ts`.
3. Un module n'importe d'un autre module que son `index.ts`. Si deux modules doivent collaborer sur un écran, c'est la page dans `app/` qui les compose.
4. `domain/` ne dépend de rien d'autre que de lui-même (ni React, ni Next.js, ni bibliothèque).
5. `application/` ne dépend ni de `ui/` ni de `infrastructure/`.
6. `shared/` ne dépend ni des modules ni de `app/`.
7. Le module `administration` n'est utilisé que par `app/admin/`, et l'espace public n'importe rien de `app/admin/`.

En plus, importer un `server.ts` depuis un composant `"use client"` fait échouer `next build`, grâce à `import "server-only"`.

### Ajouter un composant shadcn/ui

```bash
npx shadcn@latest add dialog
```

`components.json` écrit les composants dans `src/shared/components/ui`. On ne les modifie pas pour y mettre du métier : un composant métier (comme `CarteEvenement`) vit dans `src/features/<feature>/components` et **assemble** les composants de `shared/components/ui`.

### Cache

`cacheComponents` est activé (ADR 0004) : rien n'est mis en cache par défaut. Une fonction ou un composant n'est mis en cache que s'il porte `"use cache"`, dans `src/features/<feature>/server.ts`. Les données propres à un utilisateur ne vont jamais dans un cache partagé.

### Sécurité

Voir l'ADR 0008. En résumé : en-têtes de sécurité sur toutes les pages, CSP en mode Report-Only, aucune image externe autorisée, et **toute Server Action est un endpoint public** qui valide ses entrées avec Zod et vérifie les droits.

## Tests

- **Unitaires et composants** (Vitest + Testing Library) : à côté du code, en `*.test.ts(x)`. Le seuil de couverture (80 %) ne s'applique qu'à `domain/` et `application/`.
- **Bout en bout** (Playwright) : dans `e2e/`. Ils vérifient la page d'accueil, l'absence de violation d'accessibilité WCAG A/AA (axe), les en-têtes de sécurité et la page 404.
  Ils ne dépendent ni de la base ni de l'API Spring : Playwright démarre d'abord une **API factice** (`e2e/api-factice/serveur.mjs`, port 8089, sans dépendance) qui reproduit le contrat HTTP pour un visiteur sans compte avec les données de démonstration, puis lance Next avec `API_URL` pointant dessus. Si un test E2E a besoin d'une nouvelle route, on l'ajoute à ce serveur en respectant le contrat de l'API.

## Git et déploiement

- On ne travaille jamais directement sur `main` : `git switch main`, `git pull`, puis `git switch -c <sujet>`.
- Préfixes de commit : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.
- Chaque pull request lance la CI (3 jobs parallèles : qualité, unitaires, e2e) et une preview Vercel.
- Fusionner dans `main` déploie en production sur Vercel.
- Dependabot propose chaque semaine les mises à jour de npm et des GitHub Actions.

## Décisions

Les décisions d'architecture sont dans [`docs/adr/`](docs/adr). Chacune a un statut (Acceptée ou Reportée) et, si elle est reportée, le moment où y revenir.

### Reporté après le Sprint 0

| Sujet                                 | À reprendre quand                                           |
| ------------------------------------- | ----------------------------------------------------------- |
| Thème sombre (ADR 0006)               | Les utilisateurs le demandent                               |
| Authentification (ADR 0007)           | Une fonctionnalité doit savoir qui est l'utilisateur        |
| CSP bloquante à nonce (ADR 0008)      | Authentification, contenu tiers ou données sensibles        |
| Envoi des Web Vitals en production    | Premiers utilisateurs réels                                 |
| Sentry / OpenTelemetry                | Premiers utilisateurs réels (brancher `instrumentation.ts`) |
| MSW pour simuler l'API dans les tests | L'API existe                                                |
| Storybook ou catalogue de composants  | Plus de 15 composants partagés ou un second contributeur    |
| Gestion d'état global, TanStack Query | Un vrai besoin d'état client partagé entre routes           |
| TypeScript 7                          | Next.js et l'outillage le prennent officiellement en charge |
