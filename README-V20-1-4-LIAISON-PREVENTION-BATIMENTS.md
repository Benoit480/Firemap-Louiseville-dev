# FireMap V20.1.4 — Liaison Prévention / Bâtiments

Cette version part de la V20.1.3 validée.

## Nouveautés
- La fiche Bâtiment conserve l’ancien préplan opérationnel.
- Un bouton `🛡️ Prévention` est ajouté dans chaque fiche Bâtiment.
- Après l’enregistrement d’une visite, FireMap met à jour automatiquement le bâtiment :
  - FDC;
  - électricité;
  - gaz;
  - matières dangereuses;
  - accès;
  - risques confirmés;
  - observations;
  - occupation;
  - date, inspecteur, prochaine révision et score.
- Les anciens renseignements ne sont remplacés que lorsqu’une nouvelle valeur de prévention est réellement inscrite.
- Les collections Firebase `batiments` et `prevention` restent séparées pour assurer la compatibilité.

## Installation
1. Remplacer les fichiers de la branche GitHub de développement.
2. Aucun changement aux règles Firebase n’est nécessaire.
3. Faire `Ctrl + F5` sur PC.
4. Fermer complètement la PWA sur iPhone, puis la rouvrir.
