
let taches = [
    { id: 1, titre: 'Lire la doc', faite: false },
    { id: 2, titre: 'Écrire les tests', faite: false },
    { id: 3, titre: 'Déployer', faite: true }
];

function genererId() {
    return Math.max(0, ...taches.map(tache => tache.id)) + 1;
}

const actions = {
    basculer: (taches, id) => {
        return taches.map(tache => {
            if (tache.id === id) {
                return { ...tache, faite: !tache.faite };
            }

            return tache;
        });
    },

    supprimer: (taches, id) => {
        return taches.filter(tache => tache.id !== id);
    },

    dupliquer: (taches, id) => {
        const index = taches.findIndex(tache => tache.id === id);

        if (index === -1) return taches;

        const copie = {
            ...taches[index],
            id: genererId(),
            titre: taches[index].titre + ' (copie)'
        };

        return [
            ...taches.slice(0, index + 1),
            copie,
            ...taches.slice(index + 1)
        ];
    },

    monter: (taches, id) => {
        const index = taches.findIndex(tache => tache.id === id);

        if (index <= 0) return taches;

        const nouveauTableau = [...taches];

        [nouveauTableau[index - 1], nouveauTableau[index]] =
        [nouveauTableau[index], nouveauTableau[index - 1]];

        return nouveauTableau;
    }
};

function render() {
    const liste = document.querySelector('#taches');

    liste.textContent = '';

    taches.forEach(tache => {
        const li = document.createElement('li');

        li.dataset.id = tache.id;
        li.className = 'tache';

        li.innerHTML = `
            <span class="${tache.faite ? 'terminee' : ''}">
                ${tache.titre}
            </span>

            <div class="actions">
                <button data-action="basculer">Basculer</button>
                <button data-action="dupliquer">Dupliquer</button>
                <button data-action="monter">Monter</button>
                <button data-action="supprimer">Supprimer</button>
            </div>
        `;

        liste.append(li);
    });
}

document.querySelector('#taches').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    const li = bouton.closest('li');
    const action = bouton.dataset.action;
    const id = Number(li.dataset.id);

    if (!actions[action]) {
        console.warn('Action inconnue :', action);
        return;
    }

    taches = actions[action](taches, id);

    render();
});

render();
