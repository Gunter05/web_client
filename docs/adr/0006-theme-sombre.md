# 0006 — Thème sombre

Statut : Acceptée (mise en œuvre le 2026-10-19)
Date : 2026-10-10

## Contexte

shadcn/ui gère nativement un thème sombre via des variables CSS. L'ajouter tard oblige à repasser sur toutes les couleurs.

## Décision

Pas de thème sombre en Sprint 0. En revanche, toutes les couleurs passent par des variables (tokens) définies dans `globals.css`, jamais par des couleurs écrites en dur.

## Alternatives

- Thème sombre dès le départ avec `next-themes` : plus de travail de design et de tests pour un besoin non exprimé.

## Conséquences

- Ajouter le thème sombre plus tard reviendra à définir les tokens `.dark`, sans toucher aux composants.
- À reprendre quand les utilisateurs le demandent ou quand le design system est stabilisé.

## Mise en œuvre (2026-10-19)

- Trois choix : **comme l'appareil** (par défaut), **sombre**, **clair**, depuis le tiroir « Plus » (ordinateur) et le menu du compte ou l'en-tête (téléphone). Mémorisé dans ce navigateur (`localStorage`, clé `contineng:theme`).
- La classe `dark` est posée sur `<html>` par un petit script dans `<head>`, avant le premier affichage : pas de flash clair. Ensuite, `useTheme` la tient à jour, y compris quand l'appareil change de réglage.
- Pas de `next-themes` : quelques lignes suffisent (`shared/lib/theme.ts`, `shared/hooks/useTheme.ts`).
- Les couleurs passent toutes par les variables de `globals.css` ; les couleurs d'état (succès, avertissement, danger) ont reçu leurs valeurs sombres.
