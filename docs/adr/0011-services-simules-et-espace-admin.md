# 0011 — Services externes simulés et espace Administration

Statut : Acceptée
Date : 2026-10-16
Complète : 0003

## Contexte

La V1 a besoin de données persistantes, d'images, de mesures et d'un espace d'administration séparé de l'espace public, alors que l'API n'existe pas.

## Décision

**Services simulés.** Chaque module persiste ses données dans son propre fichier `data/<collection>.json` (écriture atomique), créé avec des données de démonstration au premier accès :

| Service           | Simulation                             | Emplacement                              |
| ----------------- | -------------------------------------- | ---------------------------------------- |
| Base de données   | Fichiers JSON par module               | `src/shared/stockage/collection-json.ts` |
| Stockage d'images | `data/media`, servi par `/media/[nom]` | `src/shared/stockage/fichiers.ts`        |
| Images de démo    | SVG générés, servis par `/demo/[nom]`  | `src/shared/stockage/images-demo.ts`     |
| Authentification  | Voir ADR 0010                          | `src/modules/identite/infrastructure`    |
| Analytics         | Journal `data/mesures.json`            | `src/modules/mesure/infrastructure`      |

**Espace Administration.** Une seule app : l'espace public vit dans `src/app/(public)`, l'administration dans `src/app/admin` avec son propre layout, sa garde serveur (rôle admin) et sa navigation. Le module `administration` n'est importé que par `src/app/admin` (règle dependency-cruiser).

**Collaboration entre modules.** Un module n'importe d'un autre que son `index.ts` ; les Server Actions (`src/app/_actions`) et les services de composition (`src/app/_services`) orchestrent les modules (ex. accepter une demande puis notifier le demandeur).

## Conséquences

- Les fichiers ne sont pas inscriptibles sur Vercel : le déploiement attend l'API ou un adapter vers une base hébergée.
- Supprimer `data/` réinitialise la démonstration.
- L'admin pourra être servi sur un sous-domaine via `proxy.ts` sans changer le code.
