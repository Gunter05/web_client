# 0008 — Sécurité HTTP et Server Actions

Statut : Acceptée
Date : 2026-10-12

## Contexte

Un réseau social manipule des données d'utilisateurs. Le navigateur applique des protections supplémentaires si le serveur les demande par des en-têtes HTTP.
Les Server Actions de Next.js ressemblent à de simples fonctions, mais chacune devient une adresse HTTP que n'importe qui peut appeler, même sans passer par l'interface.

## Décision

- `next.config.ts` envoie sur toutes les pages : `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, et `poweredByHeader: false` masque l'en-tête `X-Powered-By`.
- La Content Security Policy est en mode **Report-Only** : le navigateur signale les violations sans rien bloquer.
- `images.remotePatterns` est vide : aucune image externe n'est autorisée tant qu'on n'en a pas besoin.
- **Toute Server Action est un endpoint public.** Elle valide ses entrées avec Zod et vérifie les droits de l'utilisateur, même si le bouton qui l'appelle est caché.

## Alternatives

- CSP stricte à nonce dès maintenant : elle obligerait à rendre toutes les pages dynamiques, sans bénéfice tant qu'il n'y a ni contenu tiers ni compte utilisateur.
- Pas d'en-têtes : plus simple, mais laisse le site exposé au clickjacking et au reniflage de type MIME.

## Conséquences

- Un test E2E (`e2e/securite.spec.ts`) vérifie la présence des en-têtes.
- Ajouter un service tiers (analytics, images, vidéos) demande de mettre à jour la CSP et `remotePatterns`.
- À revoir quand l'authentification arrive (ADR 0007) ou dès qu'un contenu tiers est intégré : passer la CSP en mode bloquant, à nonce si nécessaire.
