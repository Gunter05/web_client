# 0017 — Notifications push avec Firebase Cloud Messaging

Statut : Acceptée
Date : 2026-10-23
Complète : ADR 0016 du backend (appareils push, textes écrits par l'API)

## Contexte

Les notifications n'existaient que dans la cloche : il fallait ouvrir le site pour les voir. Une application mobile est prévue prochainement ; sur Android, une application native ne reçoit de push que par Firebase Cloud Messaging (FCM), et FCM relaie aussi vers Apple (APNs) et vers les navigateurs (Web Push). Le site est déjà installable (PWA), condition pour recevoir des push sur iPhone (iOS 16.4 ou plus récent).

La documentation FCM (mise à jour du 22/10/2026) déprécie les jetons d'enregistrement (`getToken`) au profit des **identifiants d'installation Firebase** (FID) : `register()` déclenche `onRegistered(fid)` à chaque enregistrement et quand le FID change, `unregister()` déclenche `onUnregistered(fid)`, sans rafraîchissement périodique côté client.

## Décision

- **FCM pour le web et, plus tard, le mobile** : un seul canal côté API. Le SDK `firebase` (13.x) n'utilise que `app` et `messaging`, sans Analytics.
- **Configuration** : valeurs publiques `NEXT_PUBLIC_FIREBASE_*` (configuration de l'application Web et clé VAPID publique), validées par Zod. Si l'une manque, les push sont désactivés et le reste du site fonctionne.
- **Service worker** `/firebase-messaging-sw.js`, servi par une route (`src/app/firebase-messaging-sw.js/route.ts`) qui l'écrit avec la configuration et la version installée du SDK (`SDK_VERSION`, versions compat chargées depuis `www.gstatic.com`, comme le recommande la documentation). Les messages de l'API contiennent titre, texte et lien (`fcm_options.link`) : le SDK les affiche et ouvre le lien sans code de notre part.
- **Enregistrement** (`usePushNotifications`) : `register()` puis `onRegistered(fid)` → Server Action `registerPushDeviceAction` (Zod, session) → `PUT /api/v1/me/push-devices/{fid}` avec la langue de l'interface. L'appareil se réenregistre à chaque visite d'une personne connectée (`PushSync`, dans les deux espaces), ce qui le garde actif côté API.
- **Permission demandée au clic seulement**, depuis le profil (`PushToggle`), jamais à l'arrivée sur le site. États : indisponible (navigateur, iPhone sans installation, Firebase non configuré), bloqué, désactivé, activé.
- **Déconnexion** : le FID de ce navigateur est gardé dans un cookie httpOnly (`contineng_push`) ; `logoutAction` le retire de l'API avant d'effacer la session, pour qu'un appareil partagé ne reçoive plus les push du compte précédent.
- **Site ouvert** : `onMessage` affiche un toast ; la cloche se met à jour par son interrogation habituelle.
- **CSP** (en observation) : `https://www.gstatic.com` pour le SDK du service worker, `https://*.googleapis.com` pour l'enregistrement.

## Conséquences

- Il faut la **clé VAPID publique** (console Firebase → Paramètres du projet → Cloud Messaging → Certificats Web Push) et, côté API, la **clé du compte de service** (`FIREBASE_CREDENTIALS`, secret) pour que des push partent réellement.
- Les push exigent HTTPS (ou `localhost`). Sur iPhone, il faut d'abord ajouter le site à l'écran d'accueil.
- Les textes des push sont écrits par l'API (`push-texts_<langue>.properties`) et doivent rester alignés sur `notifications.*` des catalogues du front.
