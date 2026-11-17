import { genererId } from './utils.js';

export const tachesInitiales = [
    { id: 1, titre: 'Lire la doc', faite: false },
    { id: 2, titre: 'Écrire les tests', faite: false },
    { id: 3, titre: 'Déployer', faite: true }
];

export const actions = {
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
            id: genererId(taches),
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

export default actions;
