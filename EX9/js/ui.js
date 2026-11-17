function creerBouton(nom) {
    const bouton = document.createElement('button');

    bouton.type = 'button';
    bouton.dataset.action = nom;
    bouton.textContent = nom;

    return bouton;
}

export function render(taches) {
    const liste = document.querySelector('#taches');

    liste.textContent = '';

    taches.forEach(tache => {
        const li = document.createElement('li');
        const titre = document.createElement('span');
        const actions = document.createElement('div');

        li.className = 'tache';
        li.dataset.id = tache.id;

        titre.className = tache.faite ? 'titre terminee' : 'titre';
        titre.textContent = tache.titre;

        actions.className = 'actions';
        ['basculer', 'dupliquer', 'monter', 'supprimer'].forEach(nom => {
            actions.append(creerBouton(nom));
        });

        li.append(titre, actions);
        liste.append(li);
    });
}

export default render;
