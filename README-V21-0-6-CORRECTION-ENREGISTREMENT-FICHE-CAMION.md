# FireMap V21.0.6 — Correction de l’enregistrement des fiches camion

## Corrections
- Le formulaire n’utilise plus la fermeture automatique `method="dialog"`.
- Le bouton `Enregistrer la fiche` possède maintenant son propre gestionnaire.
- La fiche est toujours enregistrée localement avant Firebase.
- Une erreur Firebase ne peut plus faire disparaître la fiche.
- Le profil de l’unité est actualisé immédiatement après l’enregistrement.
- La fiche liée à l’événement actif est prioritaire dans le profil.
- Des messages d’erreur sont affichés si le véhicule n’est pas reconnu.

Aucune nouvelle règle Firebase n’est nécessaire.
