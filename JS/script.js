fetch('../back-end/data.json')
    .then(response => response.json())
    .then(data => { 
        const container = document.getElementById('liste-covoiturages');
        const modele = document.querySelector('.modele-covoiturage');

        container.innerHTML = '';

        console.log('Container :', container);
        console.log('modele :', modele);

      data.covoiturages.forEach(trajet => {
        const copie = modele.cloneNode(true);
        copie.classList.remove('modele-covoiturage');
        copie.style.display = 'flex';

        const chauffeur = data.utilisateurs.find(u => u.id === trajet.chauffeur_id);
        const textChauffeur = `${chauffeur.pseudo}`;
        copie.querySelector('.nom-chauffeur').textContent = textChauffeur;

        const vehicule = data.véhicules.find(v => v.id === trajet.véhicule_id);
        const textVoiture = `${vehicule.marque} ${ vehicule.modèle} • ${vehicule.carburant}`;
        copie.querySelector('.voiture').textContent = textVoiture;
        
        copie.querySelector('.depart').textContent = trajet.point_de_départ;
        copie.querySelector('.destination').textContent = trajet.destination;


        const textHoraire = `${trajet.heure_depart} • ${trajet.heure_arrivée}`;
        copie.querySelector('.horaire').textContent = textHoraire;

        const textPrix = `${trajet.prix} Cr`;
        copie.querySelector('.prix').textContent = textPrix;

        container.appendChild(copie);
    })
  })

      .catch(error => console.error('Error fetching data:', error));