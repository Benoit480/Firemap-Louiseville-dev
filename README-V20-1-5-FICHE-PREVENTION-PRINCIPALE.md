# FireMap V20.1.5 — Fiche Prévention principale

Cette version part de la V20.1.4 validée.

## Fonctionnement
- Un clic sur un bâtiment ouvre directement la fiche Prévention/Opérations.
- Cette fiche devient l'écran principal du bâtiment.
- L'ancien préplan reste intact et accessible par le bouton `📁 Anciennes données`.
- Les anciennes données ne sont ni supprimées ni migrées de force.
- Les informations enregistrées continuent de mettre à jour la collection `batiments`.
- Les collections Firebase `batiments` et `prevention` restent séparées.
- Aucun changement aux règles Firebase n'est nécessaire.

## Installation
1. Remplacer les fichiers de la branche GitHub de développement.
2. Faire `Ctrl + F5` sur PC.
3. Fermer complètement la PWA sur iPhone, puis la rouvrir.
4. Tester :
   - ouvrir un bâtiment depuis la carte;
   - enregistrer la fiche;
   - ouvrir `Anciennes données`;
   - vérifier bornes, SMS, GPS et navigation.
