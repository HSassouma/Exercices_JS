const CLE = 'taches:v1';

let taches = [];

function charger() {
    try {
        const texte = localStorage.getItem(CLE);

        if (texte === null) {
            return [];
        }

        const donnees = JSON.parse(texte);

        return Array.isArray(donnees) ? donnees : [];
    } catch (erreur) {
        console.warn('Liste illisible, on repart d\'une liste vide.');
        return [];
    }
}

function sauver(taches) {
    localStorage.setItem(CLE, JSON.stringify(taches));
}

function render() {
    const liste = document.querySelector('#liste');
    const vide = document.querySelector('#vide');

    liste.textContent = '';

    taches.forEach(tache => {
        const li = document.createElement('li');
        li.textContent = tache.texte;
        liste.append(li);
    });

    vide.classList.toggle('cache', taches.length > 0);
}

document.querySelector('#form').addEventListener('submit', event => {
    event.preventDefault();

    const champ = document.querySelector('#texte');
    const texte = champ.value.trim();

    if (texte === '') return;

    taches = [...taches, { id: Date.now(), texte: texte }];
    sauver(taches);
    render();

    champ.value = '';
    champ.focus();
});

taches = charger();
render();
