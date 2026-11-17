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

            if (statut === 'encours' && compteurs.encours >= LIMITE_ENCOURS) {
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

cartes = charger();
render();
