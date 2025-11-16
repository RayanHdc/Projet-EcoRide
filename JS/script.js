let data = null;
let container = null;
let modele = null;

const stars = document.querySelectorAll('.filter-star');
let selectedNote = 0;

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const value = star.dataset.value;
    FullStar(value);
  });

  star.addEventListener('mouseout', () => {
    FullStar(selectedNote);
  });

star.addEventListener('click', () => {
    selectedNote = star.dataset.value;
    FullStar(selectedNote);
  });
});

function FullStar(note) {
    stars.forEach(star => {
        if (star.dataset.value <= note) {
                star.innerHTML = '&#9733;'; 
            } else {
                star.innerHTML = '&#9734;'; 
            }
        });
    };

fetch('../back-end/data.json')
    .then(response => response.json())
    .then(json => { 
        data = json;

        container = document.getElementById('liste-covoiturages');
        modele = document.querySelector('.modele-covoiturage');

        afficherCovoituragesÉcologiques();
        initialiserFiltres();
    })
    .catch(error => console.error('Error fetching data:', error));

        
function afficherCovoituragesÉcologiques() {
    container.innerHTML = '';

  let trajetsFiltres = data.covoiturages.filter(trajet => trajet.statut === "Prévu");

const boutonEco = document.getElementById('filtreEco');

if (boutonEco.classList.contains('active')) {
    trajetsFiltres = trajetsFiltres.filter(trajet => trajet.écologique === true);
}


  trajetsFiltres.forEach(trajet => {
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
        copie.querySelector('.duree-estimee').textContent = trajet.durée_estimée;


        const textHoraire = `${trajet.heure_depart} • ${trajet.heure_arrivée}`;
        copie.querySelector('.horaire').textContent = textHoraire;

        const textPrix = `${trajet.prix} `;
        copie.querySelector('.price-value').textContent = textPrix;

        const infosEco = copie.querySelector('.infos-eco');

          if (!trajet.écologique) {
            infosEco.style.opacity = "0.3";
          }

        const fumeurIcon = copie.querySelector('.fumeur-icon');
        const nonFumeurIcon = copie.querySelector('.non-fumeur-icon');

        const animalsIcon = copie.querySelector('.animal-icon');
        const noAnimalsIcon = copie.querySelector('.no-animals-icon');

        if (trajet.écologique === true) {
            infosEco.style.opacity = "1";
        } else {
            infosEco.style.opacity = "0.3";
        }

        if (vehicule.préférences.fumeur === true) {
            fumeurIcon.style.display = 'inline';
            nonFumeurIcon.style.display = 'none';
        } else {
            fumeurIcon.style.display = 'none';
            nonFumeurIcon.style.display = 'inline';
        }

        if (vehicule.préférences.animaux === true) {
            animalsIcon.style.display = 'inline';
            noAnimalsIcon.style.display = 'none';
        } else {
            animalsIcon.style.display = 'none';
            noAnimalsIcon.style.display = 'inline';
        } 

  const note = chauffeur.note;
  const ratingContainer = copie.querySelector('.rating');

  ratingContainer.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const starElement = document.createElement('span');
    starElement.classList.add('star');

    if (note >= i) {
     starElement.classList.add('full');
    
    } else if (note >= i - 0.5) {
      starElement.classList.add('half');
    }

  starElement.textContent = "★";
  ratingContainer.appendChild(starElement);
  }

        container.appendChild(copie);
      });
}

function initialiserFiltres() {
    const boutonEco = document.getElementById('filtreEco');

    boutonEco.addEventListener('click', () => {
    boutonEco.classList.toggle('active');
    afficherCovoituragesÉcologiques();
});
}
