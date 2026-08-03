# FireMap V22.1.0 — Journal d’intervention automatique

## Entrées automatiques
Le journal détecte les changements enregistrés dans les fiches véhicules :
- véhicule en route;
- arrivée sur les lieux;
- retour vers la caserne;
- changement ou perte d’alimentation;
- ouverture et fermeture d’une sortie;
- changement de pression, secteur ou affectation d’une sortie active;
- modification du résiduel initial ou final;
- appel reçu;
- début et fin de l’événement.

## Entrées manuelles
Le chef peut choisir :
- catégorie;
- importance;
- auteur;
- texte libre.

## Importance
- Information;
- Attention;
- Important;
- Critique.

Une pression résiduelle sous 20 PSI est automatiquement classée critique.
Une pression sous 30 PSI est classée Attention.

## Filtres
- Tout;
- Véhicules;
- Alimentation;
- Sorties;
- Pressions;
- Notes du chef;
- Critiques.

## Stockage
Le journal est conservé dans l’événement existant et synchronisé avec Firebase.
Aucune nouvelle règle Firebase n’est nécessaire.
