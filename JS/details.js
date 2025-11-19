const params = new URLSearchParams(window.location.search);
const TrajetID = parseInt(params.get('id')); 

if (!TrajetID) {
    console.log("Aucun ID correspondant");
}

fetch('../back-end/data.json')
  .then(response => response.json())
  .then(data => AfficherDetails(data))
  .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));

  function conversionDateLettre(dateISO) {
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const dateObjet = new Date(dateISO);

    const jourSemaine = jours[dateObjet.getDay()];
    const jourMois = dateObjet.getDate();
    const moisAnnee = mois[dateObjet.getMonth()];

    return `${jourSemaine} ${jourMois} ${moisAnnee}`;
}

  function AfficherDetails(data) {

    const trajet = data.covoiturages.find(t => t.id === TrajetID);

    if (!trajet) {
        console.log("Trajet non trouvé");
        return;
    }

    const chauffeur = data.utilisateurs.find(c => c.id === trajet.chauffeur_id);
    const vehicule = data.véhicules.find(v => v.id === trajet.véhicule_id);

    document.querySelectorAll('.depart').forEach(element => {
        element.textContent = trajet.point_de_départ;
    });
    document.querySelectorAll('.destination').forEach(element => {
        element.textContent = trajet.destination;
    });

    document.querySelectorAll('.date-trajet').forEach(element => {
        element.textContent = conversionDateLettre(trajet.date_depart);
    });
    document.querySelectorAll('.horaire-depart').forEach(element => {
        element.textContent = trajet.heure_depart;
    });
    document.querySelectorAll('.horaire-destination').forEach(element => {
        element.textContent = trajet.heure_arrivée;
    });
    document.querySelectorAll('.duree-estimee').forEach(element => {
        element.textContent = trajet.durée_estimée;
    });
    document.querySelectorAll('.price-value').forEach(element => {
        element.textContent = trajet.prix;
    });
    document.querySelectorAll('.places-disponibles-value').forEach(element => {
        element.textContent = `${trajet.places_disponibles} places disponibles`;
    });


    const ecoInfo = document.querySelector('.infos-eco');
    ecoInfo.style.opacity = trajet.écologique ? '1' : '0.3';

    const fumeurIcon = document.querySelector('.fumeur-icon');
    const nonFumeurIcon = document.querySelector('.non-fumeur-icon');

    const animalsIcon = document.querySelector('.animal-icon');
    const noAnimalsIcon = document.querySelector('.no-animals-icon');

    if (vehicule.préférences.fumeur === true) {
        document.querySelector('#smoking-yes').style.display = 'flex';
        document.querySelector('#smoking-no').style.display = 'none';
    } else {
        document.querySelector('#smoking-yes').style.display = 'none';
        document.querySelector('#smoking-no').style.display = 'flex';
    }

    if (vehicule.préférences.animaux) {
        document.querySelector('#animals-yes').style.display = 'flex';
        document.querySelector('#animals-no').style.display = 'none';
    } else {
        document.querySelector('#animals-yes').style.display = 'none';
        document.querySelector('#animals-no').style.display = 'flex';
    }

    document.querySelector('.nom-chauffeur').textContent = chauffeur.nom;
    document.querySelector('.voiture').textContent = `${vehicule.marque} ${vehicule.modèle} • ${vehicule.carburant}`;


    AfficherNote(chauffeur.note);
  }

    function AfficherNote(note) {
        const ratingContainer = document.querySelector('.rating');
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