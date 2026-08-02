# FireMap V21.0.7 — Correction affichage fiche dans le profil de l’unité

## Correction
La fiche était correctement enregistrée et visible au Centre de commandement, mais le profil de l’unité dépendait seulement de la copie en mémoire du module.

Le profil :
- relit maintenant directement `firemap-vehicle-usages-v2`;
- combine les données locales et Firebase;
- reconnaît une unité par son ID, son numéro ou son nom;
- priorise la fiche liée à l’événement actif;
- se rafraîchit directement après l’enregistrement;
- se rafraîchit après une synchronisation Firebase.

Aucune nouvelle règle Firebase n’est nécessaire.
