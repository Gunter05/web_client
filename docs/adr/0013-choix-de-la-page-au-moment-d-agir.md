# 0013 — Choix de la page au moment d'agir

Statut : Acceptée
Date : 2026-10-19
Remplace : le « profil actif » de US-37 (sélecteur de profil, cookie `contineng_page_active`)

## Contexte

Pour publier, un membre devait d'abord « basculer » sur une de ses pages avec un sélecteur façon « changer de compte ». Ce mode caché avait plusieurs défauts : le bouton « Créer » n'apparaissait qu'après la bascule, un bandeau rappelait en permanence la page active, l'état survivait dans un cookie (avec une alerte quand l'accès était retiré entre-temps), et « Mes événements » ou « Accès » changeaient de contenu selon cet état invisible.

## Décision

- **Un seul compte, pas de bascule.** Le module `profil-actif`, son cookie, son bandeau et son alerte sont supprimés. `src/app/_services/acteur.ts` ne fournit plus que la personne connectée et la liste de ses pages (`PageDuMembre`, avec le rôle).
- **« Créer » est visible par tous.** `/evenements/nouveau` est une étape de choix : « Avec quelle page voulez-vous publier ? ». Le formulaire s'ouvre sur `/evenements/nouveau?page={slug}`. Sans compte, on passe par la connexion (retour conservé) ; sans page, on propose d'en demander une ; une page dont on n'est pas membre ramène au choix avec un message.
- **Espace « Mes pages ».** `/mes-pages` liste les pages du membre ; `/mes-pages/{slug}` montre leurs événements et leurs vues ; `/mes-pages/{slug}/acces` gère les contributeurs (propriétaire seulement). Les anciennes routes `/mes-evenements` et `/acces` disparaissent.
- **Droits déduits de l'objet.** Modifier ou annuler un événement est possible pour tout membre de la page organisatrice, sans bascule préalable. Les Server Actions vérifient l'appartenance à la page concernée (`maPageParId`) ; l'API revérifie toujours.

## Conséquences

- La page au nom de laquelle on publie est toujours explicite (dans l'URL de création, ou l'organisatrice de l'événement).
- Plus d'état de session à synchroniser ni d'« accès perdu » à signaler.
- Les libellés de rôle passent de `profilActif.*` à `pages.roles.*`.
