# 0016 — Modules en couches et espaces séparés

Statut : Acceptée
Date : 2026-10-19
Remplace : 0014 (organisation des dossiers ; les adresses en anglais restent valables)

## Contexte

L'organisation par features (ADR 0014) rangeait le code par rôle technique (`lib/`, `types/`, `api/`, `actions/`, `components/`) sans dire quelle couche avait le droit d'utiliser quelle autre. Les composants propres à l'Administration (onglets, pagination, recherche) étaient rangés dans la feature `admin` à côté des appels à l'API, et les coques des deux espaces vivaient dans un dossier `widgets/` sans lien visible avec les routes.

## Décision

- **`src/modules/<module>/`** remplace `src/features/`. Chaque module est découpé en couches, créées seulement si elles servent :
  - `domain/` : types et règles métier en TypeScript pur (ancien `lib/` + `types/`) ;
  - `application/` : Server Actions, qui valident (Zod), vérifient les droits et orchestrent (ancien `actions/`) ;
  - `infrastructure/` : appels à l'API et adaptation de son contrat (ancien `api/`) ;
  - `presentation/components/` : composants React du module (ancien `components/`) ;
  - `index.ts` et `server.ts` : API publique, inchangées.
- **`src/spaces/<espace>/`** remplace `src/widgets/` : `user/` (coque, barre latérale, navigation mobile) et `super-admin/` (coque, onglets, pagination, recherche, état vide, squelette). Chaque espace expose un `index.ts`.
- **Groupe de routes `(super-admin)`** autour de `admin/` ; `(user)` et `(auth)` sont conservés. Aucune URL ne change.
- **shadcn/ui** passe de `src/shared/components/ui` à `src/shared/ui` (`components.json` mis à jour).
- `NODE_ENV` est lu via `env` / `clientEnv` comme les autres variables.

Non retenus : sous-dossiers `entities/`, `value-objects/`, `repositories/`, `use-cases/`, `dto/`, `mappers/`. Les modules sont petits et l'API est appelée directement par `infrastructure/` : ces dossiers seraient vides ou ne contiendraient qu'un fichier. On les ajoutera dans un module quand sa complexité le justifiera.

## Conséquences

- dependency-cruiser vérifie en plus le sens des couches (`domain` pur, `infrastructure` sans `application` ni `presentation`, `presentation` sans `infrastructure`), l'indépendance des espaces et l'entrée des espaces par `index.ts`.
- La couverture des tests porte sur `src/modules/*/domain/`.
- Voir `docs/architecture.md` pour le guide pratique.
