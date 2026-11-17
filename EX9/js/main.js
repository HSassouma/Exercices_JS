import { tachesInitiales, actions } from './etat.js';
import render from './ui.js';

let taches = tachesInitiales;

document.querySelector('#taches').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    const nom = bouton.dataset.action;
    const id = Number(bouton.closest('li').dataset.id);
    const action = actions[nom];

    if (!action) {
        console.warn('Action inconnue :', nom);
        return;
    }

    taches = action(taches, id);

    render(taches);
});

render(taches);
