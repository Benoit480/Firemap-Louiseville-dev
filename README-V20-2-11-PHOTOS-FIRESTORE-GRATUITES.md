# FireMap V20.2.11 — Photos gratuites dans Firestore

Cette version n'utilise plus Firebase Storage pour les photos.

## Fonctionnement
- La photo est compressée sur le téléphone.
- Elle est convertie en image JPEG Base64.
- Elle est enregistrée directement dans la fiche Prévention Firestore.
- Elle reste affichée sous la bonne colonne.
- Elle est synchronisée entre les appareils par Firestore.

## Limites de sécurité
- Environ 180 Ko maximum par photo après compression.
- FireMap bloque l'enregistrement si l'ensemble des photos approche 850 Ko dans une même fiche.
- Pour conserver une fiche légère, il est recommandé de garder seulement les photos opérationnelles essentielles.

## Firebase
- Aucun forfait payant nécessaire.
- Firebase Storage n'est plus requis.
- Les règles Firestore actuelles doivent permettre l'écriture dans la collection `prevention`.
