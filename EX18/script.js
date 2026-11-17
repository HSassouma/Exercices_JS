const TOTAL_ETAPES = 3;

const regles = {
    1: {
        nom: formulaire => formulaire.elements.nom.value.trim().length >= 3
            ? ''
            : 'Le nom doit contenir au moins 3 caractères.',
        email: formulaire => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formulaire.elements.email.value.trim())
            ? ''
            : 'L\'email doit ressembler à nom@domaine.com.'
    },
    2: {
        formation: formulaire => formulaire.elements.formation.value !== ''
            ? ''
            : 'Choisis une formation.',
        ville: formulaire => formulaire.elements.ville.value.trim() !== ''
            ? ''
            : 'Indique ta ville.'
    },
    3: {
        cgu: formulaire => formulaire.elements.cgu.checked
            ? ''
            : 'Tu dois accepter le règlement.'
    }
};

const formulaire = document.querySelector('#assistant');
const erreur = document.querySelector('#erreur');
const confirmation = document.querySelector('#confirmation');

let etape = 1;
let donnees = {};

function validerEtape(numero) {
    const reglesEtape = regles[numero];

    for (const champ of Object.keys(reglesEtape)) {
        const message = reglesEtape[champ](formulaire);

        if (message !== '') {
            return message;
        }
    }

    return '';
}

function lireChamps() {
    return Object.fromEntries(new FormData(formulaire));
}

function remplirChamps(donnees) {
    formulaire.elements.nom.value = donnees.nom || '';
    formulaire.elements.email.value = donnees.email || '';
    formulaire.elements.formation.value = donnees.formation || '';
    formulaire.elements.ville.value = donnees.ville || '';
    formulaire.elements.cgu.checked = donnees.cgu === 'on';
}

function afficherRecap() {
    const recap = document.querySelector('#recap');
    const lignes = [
        ['Nom', donnees.nom],
        ['Email', donnees.email],
        ['Formation', donnees.formation],
        ['Ville', donnees.ville]
    ];

    recap.textContent = '';

    lignes.forEach(([libelle, valeur]) => {
        const p = document.createElement('p');
        const nom = document.createElement('span');

        nom.textContent = libelle + ' : ';
        p.append(nom, valeur || '');
        recap.append(p);
    });
}

function afficherEtape() {
    document.querySelectorAll('#assistant fieldset').forEach(fieldset => {
        fieldset.classList.toggle('cache', Number(fieldset.dataset.etape) !== etape);
    });

    document.querySelector('#progression').style.width = (etape / TOTAL_ETAPES) * 100 + '%';
    document.querySelector('#precedent').classList.toggle('cache', etape === 1);
    document.querySelector('#suivant').textContent = etape === TOTAL_ETAPES ? 'Envoyer' : 'Suivant';

    erreur.textContent = '';

    if (etape === TOTAL_ETAPES) {
        afficherRecap();
    }
}

afficherEtape();
