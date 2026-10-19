# 0012 — Branchement sur l'API Spring

Statut : Acceptée
Date : 2026-10-18
Remplace : 0010, 0011 (partie « services simulés »)

## Contexte

L'API `le-contineng` (Spring Boot) couvre maintenant toute la V1. Les fichiers JSON, l'authentification simulée et le stockage d'images local ne servent plus.

## Décision

- **Données** : chaque module garde ses couches `domain/`, `infrastructure/`, `ui/`, mais son infrastructure est un adaptateur HTTP (`api-*.ts`) qui appelle l'API via `src/shared/api/client.ts`. Les règles métier font foi côté API ; le front ne garde que les types, l'affichage et une prévalidation des formulaires (pour ne pas téléverser une photo inutilement).
- **Authentification** : l'API signe un JWT (HS256, 30 jours) à l'inscription et à la connexion. Le front le garde dans le cookie httpOnly `contineng_jeton` et l'envoie en `Authorization: Bearer` depuis le serveur uniquement. Le navigateur n'appelle jamais l'API directement.
- **Images** : téléversées par les Server Actions sur `POST /api/v1/medias`, stockées sur disque par l'API. `next.config.ts` réécrit `/api/v1/medias/:id` vers l'API : les images restent sur la même origine (CSP `img-src 'self'` inchangée).
- **Erreurs** : l'API renvoie un `ProblemDetail` avec `code` et `champs`, traduits par les catalogues i18n existants.
- **Admin** : le rôle est vérifié par l'API à chaque appel ; la garde du front ne sert qu'à l'affichage.

## Conséquences

- `API_URL` est nécessaire (défaut `http://localhost:8080`). Lancer l'API avec le profil `local` charge les données de démo.
- Les dossiers `application/` et le stockage JSON du front sont supprimés ; les tests métier vivent côté API.
