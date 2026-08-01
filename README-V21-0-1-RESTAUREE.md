# FireMap V21.0.1 — restauration

Cette correction restaure le démarrage de l’application et conserve une approche compatible :

- le menu s’appelle **Bâtiments**;
- un bâtiment ouvre la fiche de prévention/opérations comme fiche principale;
- l’ancienne collection `prevention` demeure active pour éviter la perte de données;
- les informations générales du bâtiment sont enregistrées dans `batiments`;
- l’ancien préplan reste disponible comme solution de secours en arrière-plan;
- le cache PWA a été renouvelé.

Après installation, republiez `firestore.rules`, faites Ctrl+F5 sur PC et réinstallez/rouvrez la PWA sur iPhone.
