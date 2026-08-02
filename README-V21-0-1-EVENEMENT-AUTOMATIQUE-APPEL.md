# FireMap V21.0.1 — Événement automatique lors d’un appel actif

Lorsqu’un appel est démarré dans l’Assistant d’intervention :
- un événement est automatiquement créé dans le Centre de commandement;
- l’adresse, la nature de l’appel, le niveau d’alarme et l’heure de départ sont repris;
- une entrée est ajoutée au journal;
- l’événement est synchronisé dans Firestore;
- aucun doublon n’est créé si l’événement actif correspond déjà au même appel.

Une simple sélection d’adresse sur la carte ne crée pas d’événement automatiquement.
Aucune nouvelle règle Firebase n’est nécessaire par rapport à la V21.0.0.
