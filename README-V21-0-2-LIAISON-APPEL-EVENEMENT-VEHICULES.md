# FireMap V21.0.2 — Liaison réelle appel, événement et véhicules

## Correction
- Chaque appel actif reçoit un identifiant unique `callId`.
- L’événement du Centre de commandement conserve cet identifiant dans `sourceCallId`.
- L’identifiant de l’événement actif est publié localement pour les autres modules.
- Chaque nouvelle fiche véhicule reçoit automatiquement `eventId`.
- Le Centre de commandement filtre les fiches véhicules selon son événement actif.
- Les sorties, effectifs et états affichés appartiennent donc uniquement à l’appel actif.
- Les mises à jour des fiches véhicules apparaissent immédiatement dans le poste de commandement.

## Compatibilité
Les anciennes fiches sans `eventId` restent dans l’historique, mais ne sont pas rattachées automatiquement à un nouvel appel.
Aucune nouvelle règle Firebase n’est nécessaire.
