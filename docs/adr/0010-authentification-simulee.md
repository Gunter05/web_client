# 0010 — Authentification simulée derrière un port

Statut : Remplacée par 0012
Date : 2026-10-16
Remplace : 0007

## Contexte

La V1 exige des comptes : les organisateurs publient au nom d'une page, les admins valident les pages. L'API et le fournisseur d'identité n'existent pas encore.

## Décision

Le module `identite` implémente inscription et connexion réelles mais simulées : mots de passe hachés (scrypt), jeton de session opaque dans un cookie `httpOnly` `SameSite=Lax`, comptes de démonstration (mot de passe `demo1234`). Le rôle admin est porté par le compte, jamais attribué depuis l'interface. Le profil actif (US-37) est stocké dans la session.

## Conséquences

- Remplacer la simulation revient à réécrire `src/modules/identite/infrastructure`.
- Les formulaires envoient leurs données en POST à la Server Action, même avant hydratation : jamais de mot de passe dans l'adresse.
- La CSP bloquante à nonce (ADR 0008) devient à reconsidérer.
