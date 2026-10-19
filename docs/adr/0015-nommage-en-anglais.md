# 0015 — Nommage en anglais et types alignés sur l'API

Statut : Acceptée
Date : 2026-10-19
Complète : 0014 (architecture par features)

## Contexte

Après la réorganisation par features (ADR 0014), les dossiers et les adresses étaient en anglais mais les fichiers, composants, fonctions, types, codes et clés de traduction restaient en français (`Coque.tsx`, `CarteEvenement`, `listerEvenements`, `statut: "publie"`, `t("evenements.lieu")`). On ne comprenait pas à quoi servait un fichier sans l'ouvrir, et le front traduisait en permanence les codes anglais de l'API (`party` ↔ `soiree`).

## Décision

- **Tout le code est en anglais** : fichiers (nommés d'après ce qu'ils contiennent : `Sidebar.tsx`, `EventCard.tsx`, `events.api.ts`, `url-filters.ts`), composants, fonctions, hooks, types, champs, props, variables, noms de champs HTML, paramètres d'adresse (`?period=`, `?category=`, `?returnTo=`, `?msg=`) et clés des catalogues i18n (`events.location`, `errors.required`). Les textes affichés restent traduits en français et en anglais ; les commentaires restent en français.
- **Groupe de routes `(user)`** en face de `admin/`, et mises en page `widgets/user-layout` / `widgets/admin-layout`. La navigation est découpée en un fichier par élément visible (`Sidebar`, `MobileHeader`, `BottomNav`, `navigation`).
- **Types identiques au contrat de l'API** pour les modules déjà en anglais côté back (`events`, `pages`) : `Event`, `EventView`, `Page`, `Member`, `PageRequest` reprennent les champs et les codes de l'API (`startsAt`, `organizerPageId`, `photoUrl`, `party`, `upcoming`, `published`, `owner`, `pending`…). Les réponses sont utilisées telles quelles ; il ne reste qu'une petite table par feature pour les codes d'erreur dont le message dépend du contexte (`features/<x>/api/errors.ts`).
- **Modules du back encore en français** (`comptes`, `administration`, `notifications`, `audience`, `mesure`) : leur contrat (`nom`, `creeLe`, `lue`…) n'apparaît que dans leur adaptateur (`features/<x>/api/*.api.ts`), qui convertit vers des types anglais. Quand ces modules passeront en anglais côté API, seuls ces adaptateurs changeront.
- Les codes de validation du formulaire de compte venant du back français sont traduits au même endroit, dans le client HTTP partagé.

## Conséquences

- Les liens filtrés partagés avec les anciens paramètres (`?periode=passe`, `?categorie=soiree`) ne sont plus reconnus : le fil s'affiche alors sans filtre.
- La préférence « barre latérale réduite » est stockée sous une nouvelle clé : elle revient à « étendue » une fois pour chacun.
