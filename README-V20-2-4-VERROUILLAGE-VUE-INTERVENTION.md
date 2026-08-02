# FireMap V20.2.4 — Verrouillage lié à Vue intervention

Correction du verrouillage de la fiche Bâtiment.

## Nouveau comportement
- Le bouton `🚨 Vue intervention` active explicitement le mode lecture seule.
- En ouvrant ensuite la fiche depuis cette vue :
  - cases, champs et listes sont désactivés;
  - boutons caméra/import/suppression masqués;
  - bouton Enregistrer masqué;
  - bandeau rouge de consultation seulement affiché.
- Une ouverture normale depuis le menu Bâtiments reste modifiable.
- Fermer la vue intervention réinitialise le mode forcé.

Aucun changement aux règles Firebase.
