let data = null;
let container = null;
let modele = null;

const stars = document.querySelectorAll('.filter-star');
let selectedNote = 0;

function FullStar(note) {
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= note) {
      star.innerHTML = '★';
    } else {
      star.innerHTML = '☆';
    }
  });
}

fetch('../back-end/data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    container = document.getElementById('liste-covoiturages');
    modele = document.querySelector('.modele-covoiturage');

    initialiserFiltres();
    afficherCovoiturages();
  })
  .catch(error => console.error('Error fetching data:', error));

function afficherCovoiturages() {
  if (!data || !container || !modele) return;

  container.innerHTML = '';

  let trajetsFiltres = data.covoiturages.filter(t => t.statut === 'Prévu');

  const boutonEco = document.getElementById('filtreEco');
  if (boutonEco && boutonEco.classList.contains('active')) {
    trajetsFiltres = trajetsFiltres.filter(trajet => trajet.écologique === true);
  }

  const dureeChoisie = document.getElementById('duration-filter');
  if (dureeChoisie) {
    const dureeChoisieValue = dureeChoisie.value;
    if (dureeChoisieValue !== 'all') {
      trajetsFiltres = trajetsFiltres.filter(trajet => {
        const minutes = dureeEnMinutes(trajet.durée_estimée);
        if (dureeChoisieValue === '240-600') {
          return minutes >= 240;
        }
        return minutes <= parseInt(dureeChoisieValue);
      });
    }
  }

  const minInput = document.getElementById('min-price');
  const maxInput = document.getElementById('max-price');

  const prixMin = minInput && minInput.value !== '' ? parseFloat(minInput.value) : 0;
  const prixMax = maxInput && maxInput.value !== '' ? parseFloat(maxInput.value) : Infinity;

  trajetsFiltres = trajetsFiltres.filter(trajet => trajet.prix >= prixMin && trajet.prix <= prixMax);

  if (selectedNote > 0) {
    trajetsFiltres = trajetsFiltres.filter(trajet => {
      const chauffeur = data.utilisateurs.find(u => u.id === trajet.chauffeur_id);
      return chauffeur && chauffeur.note >= selectedNote;
    });
  }

  const aucunResultat = document.getElementById('aucun-resultat');
  if (trajetsFiltres.length === 0) {
    if (aucunResultat) aucunResultat.style.display = 'block';
    return;
  }
  if (aucunResultat) aucunResultat.style.display = 'none';

  trajetsFiltres.forEach(trajet => {
    const copie = modele.cloneNode(true);
    copie.classList.remove('modele-covoiturage');
    copie.style.display = 'flex';

    const chauffeur = data.utilisateurs.find(u => u.id === trajet.chauffeur_id);
    const vehicule = data.véhicules.find(v => v.id === trajet.véhicule_id);

    if (chauffeur) {
      copie.querySelector('.nom-chauffeur').textContent = chauffeur.pseudo;
    }

    if (vehicule) {
      copie.querySelector('.voiture').textContent =
        `${vehicule.marque} ${vehicule.modèle} • ${vehicule.carburant}`;
    }

    copie.querySelector('.depart').textContent = trajet.point_de_départ;
    copie.querySelector('.destination').textContent = trajet.destination;
    copie.querySelector('.duree-estimee').textContent = trajet.durée_estimée;

    const textHoraire = `${trajet.heure_depart} • ${trajet.heure_arrivée}`;
    copie.querySelector('.horaire').textContent = textHoraire;

    copie.querySelector('.price-value').textContent = trajet.prix;

    const infosEco = copie.querySelector('.infos-eco');
    if (infosEco) {
      infosEco.style.opacity = trajet.écologique ? '1' : '0.3';
    }

    if (vehicule && vehicule.préférences) {
      const fumeurIcon = copie.querySelector('.fumeur-icon');
      const nonFumeurIcon = copie.querySelector('.non-fumeur-icon');
      const animalsIcon = copie.querySelector('.animal-icon');
      const noAnimalsIcon = copie.querySelector('.no-animals-icon');

      if (fumeurIcon && nonFumeurIcon) {
        if (vehicule.préférences.fumeur) {
          fumeurIcon.style.display = 'inline';
          nonFumeurIcon.style.display = 'none';
        } else {
          fumeurIcon.style.display = 'none';
          nonFumeurIcon.style.display = 'inline';
        }
      }

      if (animalsIcon && noAnimalsIcon) {
        if (vehicule.préférences.animaux) {
          animalsIcon.style.display = 'inline';
          noAnimalsIcon.style.display = 'none';
        } else {
          animalsIcon.style.display = 'none';
          noAnimalsIcon.style.display = 'inline';
        }
      }
    }

    if (chauffeur) {
      const note = chauffeur.note;
      const ratingContainer = copie.querySelector('.rating');
      if (ratingContainer) {
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
          const starElement = document.createElement('span');
          starElement.classList.add('star');

          if (note >= i) {
            starElement.classList.add('full');
          } else if (note >= i - 0.5) {
            starElement.classList.add('half');
          }

          starElement.textContent = '★';
          ratingContainer.appendChild(starElement);
        }
      }
    }

    container.appendChild(copie);
  });
}

function initialiserFiltres() {
  const boutonEco = document.getElementById('filtreEco');
  if (boutonEco) {
    boutonEco.addEventListener('click', () => {
      boutonEco.classList.toggle('active');
      afficherCovoiturages();
    });
  }

  const Filterduration = document.getElementById('duration-filter');
  const btnDuration = document.getElementById('btn-duration');
  if (Filterduration) {
    Filterduration.addEventListener('change', () => {
      if (btnDuration) {
        if (Filterduration.value !== 'all') {
          btnDuration.classList.add('active');
        } else {
          btnDuration.classList.remove('active');
        }
      }
      afficherCovoiturages();
    });
  }

  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');

  if (minPriceInput) {
    minPriceInput.addEventListener('input', afficherCovoiturages);
  }
  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', afficherCovoiturages);
  }

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const value = parseInt(star.dataset.value);
      FullStar(value);
    });

    star.addEventListener('mouseout', () => {
      FullStar(selectedNote);
    });

    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      if (selectedNote === value) {
        selectedNote = 0;
      } else {
        selectedNote = value;
      }
      FullStar(selectedNote);
      afficherCovoiturages();
    });
  });
}

function dureeEnMinutes(duree) {
  let h = 0;
  let m = 0;

  if (duree.includes('h')) {
    const parts = duree.split('h');
    h = parseInt(parts[0]) || 0;
    m = parseInt(parts[1]) || 0;
  } else {
    m = parseInt(duree) || 0;
  }
  return h * 60 + m;
}