const STATUTS = ['afaire', 'encours', 'fait'];
const LIMITE_ENCOURS = 3;
const CLE = 'kanban:v1';

let cartes = [];
let prochainId = 1;

function charger() {
    try {
        const texte = localStorage.getItem(CLE);

        if (texte === null) {
            return [];
        }

        const donnees = JSON.parse(texte);

        if (!Array.isArray(donnees)) {
            return [];
        }

        return donnees.filter(carte => STATUTS.includes(carte.statut));
    } catch (erreur) {
        console.warn('Tableau illisible, on repart vide.');
        return [];
    }
}

function sauver() {
    localStorage.setItem(CLE, JSON.stringify(cartes));
}

function compterParStatut() {
    return cartes.reduce((compteurs, carte) => {
        compteurs[carte.statut] = compteurs[carte.statut] + 1;
        return compteurs;
    }, Object.fromEntries(STATUTS.map(statut => [statut, 0])));
}

function render() {
    const compteurs = compterParStatut();

    document.querySelectorAll('#tableau section').forEach(section => {
        const statut = section.dataset.statut;
        const liste = section.querySelector('ul');

        liste.textContent = '';

        cartes.filter(carte => carte.statut === statut).forEach(carte => {
            const li = document.createElement('li');
            const titre = document.createElement('span');
            const fleches = document.createElement('div');
            const precedent = document.createElement('button');
            const suivant = document.createElement('button');
            const position = STATUTS.indexOf(statut);

            titre.textContent = carte.titre;

            precedent.type = 'button';
            precedent.dataset.action = 'reculer';
            precedent.dataset.id = carte.id;
            precedent.textContent = '←';
            precedent.disabled = position === 0;
            precedent.classList.toggle('masquee', position === 0);

            suivant.type = 'button';
            suivant.dataset.action = 'avancer';
            suivant.dataset.id = carte.id;
            suivant.textContent = '→';
            suivant.disabled = position === STATUTS.length - 1;
            suivant.classList.toggle('masquee', position === STATUTS.length - 1);

            const suivante = STATUTS[position + 1];

            if (suivante === 'encours' && compteurs.encours >= LIMITE_ENCOURS) {
                suivant.disabled = true;
            }

            fleches.className = 'fleches';
            fleches.append(precedent, suivant);

            li.append(titre, fleches);
            liste.append(li);
        });

        section.querySelector('.compteur').textContent = compteurs[statut];
        section.classList.toggle('pleine', statut === 'encours' && compteurs.encours >= LIMITE_ENCOURS);
    });
}

function deplacer(id, pas) {
    return cartes.map(carte => {
        if (carte.id !== id) {
            return carte;
        }

        const position = STATUTS.indexOf(carte.statut);
        const cible = STATUTS[position + pas];

        if (cible === undefined) {
            return carte;
        }

        if (cible === 'encours' && compterParStatut().encours >= LIMITE_ENCOURS) {
            return carte;
        }

        return { ...carte, statut: cible };
    });
}

document.querySelector('#form').addEventListener('submit', event => {
    event.preventDefault();

    const champ = document.querySelector('#titre');
    const titre = champ.value.trim();

    if (titre === '') return;

    cartes = [...cartes, { id: prochainId, titre: titre, statut: STATUTS[0] }];
    prochainId++;

    sauver();
    render();

    champ.value = '';
});

document.querySelector('#tableau').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton || bouton.disabled) return;

    const id = Number(bouton.dataset.id);
    const pas = bouton.dataset.action === 'avancer' ? 1 : -1;

    cartes = deplacer(id, pas);

    sauver();
    render();
});

cartes = charger();
prochainId = cartes.reduce((maximum, carte) => Math.max(maximum, carte.id), 0) + 1;
render();
