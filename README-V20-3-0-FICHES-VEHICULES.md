# FireMap V20.3.0 — Fiches véhicules en intervention

## Champs
- Choix rapide :
  - En caserne
  - En route
  - Arrivé sur les lieux
  - Retour vers caserne
- Nombre de pompiers
- Alimenté : non, borne, citerne, relais ou autre
- Nombre de sorties utilisées
- Pression utilisée (PSI)
- Résiduel initial (PSI)
- Résiduel final (PSI)
- Notes

## Fonctionnement
- Une fiche peut être créée pour chaque véhicule.
- Les fiches sont visibles dans le menu Caserne et véhicules.
- L'état et le nombre de pompiers mettent aussi à jour le véhicule.
- Historique synchronisé avec Firestore.
- Fonctionnement local si Internet est indisponible.

## Installation Firebase
Publier le nouveau fichier `firestore.rules`.
