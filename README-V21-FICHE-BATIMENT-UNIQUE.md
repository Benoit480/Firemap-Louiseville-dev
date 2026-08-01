# FireMap V21 — Fiche Bâtiment unique

Cette version remplace la séparation entre Préplans et Prévention par une seule fiche Bâtiment.

## Fonctionnement
- Le menu `Préplans` devient `Bâtiments`.
- Un clic sur un bâtiment ouvre directement la fiche complète de prévention/opérations.
- Les informations générales, vérifications, risques, photos, emplacements, observations et historique sont réunis dans la même fiche.
- L’assistant d’intervention ouvre cette même fiche.
- Les nouvelles données de prévention sont enregistrées dans le document Firestore `batiments/{id}`, dans le champ `prevention`.
- Les bornes, véhicules, navigation, SMS et adresses ne sont pas modifiés.

## Installation
1. Remplacer les fichiers de la branche GitHub de développement par ceux du ZIP.
2. Copier `firestore.rules` dans Firebase > Firestore > Règles, puis publier.
3. Faire Ctrl+F5 sur PC.
4. Fermer complètement la PWA sur iPhone, puis la rouvrir.

## Migration
L’ancienne collection `prevention` est laissée en lecture seule dans les règles pour éviter des écritures divergentes. Les fiches déjà présentes dans le cache local seront enregistrées dans les documents `batiments` lors de leur prochaine sauvegarde.
