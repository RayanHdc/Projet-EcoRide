fetch('../back-end/data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.liste-covoiturages');
    const modele = document.querySelector('.modele-covoiturage');

    container.innerHTML = ''; // vide la zone avant d’ajouter

    data.covoiturages.forEach(trajet => {
      const chauffeur = data.utilisateurs.find(u => u.id === trajet.chauffeur_id);
      const voiture = data.véhicules.find(v => v.id === trajet.véhicule_id);

      const carte = modele.cloneNode(true);
      carte.style.display = 'flex';

      // Remplissage dynamique
      carte.querySelector('.nom-chauffeur').textContent = chauffeur.prénom;
      carte.querySelector('.voiture').textContent = `${voiture.marque} ${voiture.modèle} • ${voiture.carburant}`;
      carte.querySelector('.depart').textContent = trajet.point_de_départ;
      carte.querySelector('.destination').textContent = trajet.destination;
      carte.querySelector('.horaire').textContent = `${trajet.heure_depart} → ${trajet.heure_arrivée}`;
      carte.querySelector('.prix').textContent = `${trajet.prix} crédits`;

      // Ajoute la carte au conteneur
      container.appendChild(carte);
    });
  })
  .catch(err => console.error("Erreur JSON :", err));