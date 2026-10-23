# 0018 — Modules authentication et profiles, sessions renouvelées par le proxy

Statut : Acceptée
Date : 2026-10-23
Complète : ADR 0017 du backend (modules `authentication` et `profiles`)

## Contexte

Le module `auth` du front gardait un JWT de 30 jours dans un cookie : impossible de déconnecter un appareil, de suspendre un compte, de confirmer une adresse ou de réinitialiser un mot de passe. L'API a séparé l'authentification et le profil, et donne désormais un jeton d'accès de 15 minutes et un jeton de renouvellement de 60 jours.

## Décision

- **Deux modules**, mêmes noms que l'API :
  - `authentication` : connexion, inscription, mot de passe oublié, confirmation d'adresse, appareils connectés, suspension (admin). `getCurrentAccount()` réunit le compte et le profil (`Account` : e-mail, adresse confirmée, rôle, nom, photo, langue) ;
  - `profiles` : formulaire de profil, recherche de personnes, langue préférée.
- **Deux cookies httpOnly** (`shared/api/session-cookies.ts`) : `contineng_access` (jeton d'accès, expire avec lui) et `contineng_refresh` (60 jours). L'ancien `contineng_jeton` est effacé.
- **Renouvellement dans `src/proxy.ts`** (le middleware de Next.js 16), avant le rendu et avant chaque Server Action : si le jeton d'accès manque ou expire dans moins de 30 s, le proxy l'échange contre un nouveau couple et met les cookies à jour sur la requête (rendu en cours) et sur la réponse (navigateur). Une session refusée par l'API (révoquée, compte suspendu) efface les cookies. La logique vit dans `modules/authentication/proxy.ts`, point d'entrée réservé au proxy. Deux requêtes parallèles avec le même jeton sont tolérées par l'API (30 s de grâce).
- **Navigateur de la personne** transmis à l'API à la connexion et à l'inscription (`X-Client-User-Agent`, `X-Client-IP`, option `forwardClient` du client HTTP), pour la liste des appareils.
- **Confirmation d'adresse par un bouton** (`/verify-email?token=…`), jamais à l'ouverture de la page : les messageries ouvrent parfois les liens pour les analyser. Un bandeau, dans l'espace utilisateur, rappelle de confirmer et renvoie le lien. Le jeton est renouvelé aussitôt après, pour que les actions réservées s'ouvrent sans attendre.
- **Pages** `(auth)` : `/forgot-password`, `/reset-password?token=…`, `/verify-email?token=…`. Profil : appareils connectés (déconnecter un appareil ou tous les autres). Administration : statut des comptes et suspension (1, 7, 30 jours ou sans fin).
- **Langue** : à la connexion, l'interface prend la langue du profil ; changer de langue (sélecteur des espaces) l'enregistre dans le profil.

## Conséquences

- Tout le monde se reconnecte au déploiement (nouveaux cookies, anciens jetons refusés par l'API).
- Tant qu'aucun fournisseur d'e-mails n'est branché côté API, les liens de confirmation et de réinitialisation ne sont lisibles que dans les logs de l'API.
- Les adresses des liens dépendent de `LECONTINENG_SITE_URL` côté API, qui doit être l'adresse publique du front.
