# 0014 — Architecture par features, adresses en anglais

Statut : Remplacée par [0016](0016-modules-en-couches-et-espaces.md)
Date : 2026-10-19
Remplace : l'organisation `src/modules/<module>/{domain,infrastructure,ui}` (ADR 0003 côté organisation)

## Contexte

L'organisation précédente répartissait le code entre `src/modules`, `src/app/_actions`, `src/app/_services` et des dossiers `_coque` dans les routes : la navigation dans les dossiers était difficile, et `app/` contenait bien plus que du routage. Le travail se faisait en plus dans une copie Git séparée (`.claude/worktrees`), source de confusion.

## Décision

- **Un seul dossier de projet**, sans copie de travail séparée.
- **`src/app/` = routage uniquement.** Trois groupes : `(auth)` (connexion, inscription, page épurée), `(user)` (l'application utilisateurs) et `admin/` (l'application Administration, avec sa propre coque). Les pages composent des features ; elles ne contiennent pas de logique.
- **`src/features/<feature>/`** : `components/`, `actions/` (Server Actions), `api/` (appels à l'API Spring et traduction du contrat), `lib/` (règles pures, testées), `types/`, `index.ts` (API publique), `server.ts` (API publique côté serveur). Features : `auth`, `events`, `pages`, `audience`, `notifications`, `metrics`, `admin`.
- **`src/widgets/`** : les coques qui composent plusieurs features (`user-layout`, `admin-layout`).
- **`src/shared/`** : `components/` (dont `ui/` pour shadcn et `layout/`), `api/`, `config/`, `i18n/`, `hooks/`, `lib/`.
- **Nommage des fichiers** : composants en PascalCase (`CarteEvenement.tsx`), hooks en camelCase (`useMonte.ts`), suffixes `*.api.ts`, `*.types.ts`, `*.actions.ts`. Les composants shadcn gardent leur nom d'origine (`button.tsx`) pour rester compatibles avec la CLI.
- **Adresses en anglais** : `/login`, `/register`, `/search`, `/events/new`, `/e/{id}/edit`, `/my-pages`, `/my-pages/{slug}/access`, `/page-request`, `/profile`, `/admin/page-requests`, `/admin/accounts`, `/admin/events`. Les liens permanents `/e/{id}` et `/p/{slug}` ne changent pas. Les anciennes adresses françaises redirigent (301) vers les nouvelles (`next.config.ts`), pour les liens déjà partagés et les notifications enregistrées. Les paramètres de requête (`?periode=`, `?retour=`…) sont inchangés.

Non retenus du modèle de départ : `entities/` (aucune entité n'est partagée par plusieurs features sans appartenir à l'une d'elles) et `store/` (pas d'état client global : les données viennent des Server Components et des Server Actions).

## Conséquences

- Les règles de dépendances sont vérifiées par dependency-cruiser (`npm run arch`) : entrées publiques des features, pureté de `lib/` et `types/`, indépendance de `shared/`, séparation site / Administration.
- La couverture des tests porte sur `src/features/*/lib/`.
