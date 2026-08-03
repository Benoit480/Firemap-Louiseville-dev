# FireMap V22.3.0 — GPS en direct par véhicule

- Chaque compte peut activer le GPS uniquement pour son propre véhicule.
- 202 partage le 202, 502 le 502, 802 le 802, 602 le 602, 902 le 902 et 102 le Chef 102.
- Le compte 102 voit toutes les positions sur la carte et dans le nouvel onglet GPS du Centre de commandement.
- Les comptes unités voient leur propre véhicule sur la carte.
- Affichage de la dernière mise à jour, précision GPS et vitesse.
- États GPS : en direct, retardé, position ancienne ou arrêté.
- La position est synchronisée dans la collection Firebase `vehicules` déjà existante.
- Aucune nouvelle règle Firebase.

Important : sur iPhone, l’application doit rester ouverte pour transmettre continuellement la position. iOS peut suspendre le GPS lorsque l’application est fermée ou en arrière-plan prolongé.
