# 0009 — Interface bilingue français / anglais

Statut : Acceptée
Date : 2026-10-16
Remplace : 0005

## Contexte

La spécification V1 (D2) impose une interface en français et en anglais : langue initiale selon le navigateur (anglais si ce n'est pas le français), changeable dans l'en-tête et mémorisée. Les liens d'événements partagés sur WhatsApp doivent rester stables.

## Décision

`next-intl` **sans préfixe de langue dans l'URL** : la langue est lue dans le cookie `NEXT_LOCALE`, sinon dans `Accept-Language`. Les catalogues `src/shared/i18n/messages/{fr,en}.json` sont typés (une clé absente est une erreur de compilation). Les modules renvoient des **codes** d'erreur que l'interface traduit.

## Alternatives

- Segment `[locale]` dans les routes : deux URL par fiche, ce qui casse la promesse d'un lien unique.

## Conséquences

- Aucun texte d'interface n'est écrit en dur dans les composants.
- La langue étant lue dans un cookie, tout le contenu s'affiche derrière un `<Suspense>` du layout racine (Cache Components, ADR 0004) ; `<html lang>` est ajusté côté client.
- Le contenu saisi par les pages n'est pas traduit.
