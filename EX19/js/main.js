import {
    charger,
    sauver,
    valider,
    ajouter,
    avancer,
    refuser,
    supprimer,
    retablir,
    filtrer,
    trier
} from './etat.js';
import render from './ui.js';

let app = {
    candidatures: charger(),
    statut: null,
    recherche: '',
    tri: 'date',
    annulation: null
};

let minuteurSuppression = null;

function visibles() {
    const filtrees = filtrer(app.candidatures, app.statut, app.recherche);

    return trier(filtrees, app.tri);
}

function rafraichir() {
    render(app, visibles());
}

function antiRebond(fonction, delai) {
    let minuteur;

    return (...valeurs) => {
        clearTimeout(minuteur);
        minuteur = setTimeout(() => fonction(...valeurs), delai);
    };
}

function supprimerCandidature(id) {
    const index = app.candidatures.findIndex(candidature => candidature.id === id);

    if (index === -1) {
        return;
    }

    const candidature = app.candidatures[index];

    app.candidatures = supprimer(app.candidatures, id);
    app.annulation = { candidature: candidature, index: index };

    sauver(app.candidatures);
    rafraichir();

    clearTimeout(minuteurSuppression);

    minuteurSuppression = setTimeout(() => {
        app.annulation = null;
        rafraichir();
    }, 5000);
}

document.querySelector('#form').addEventListener('submit', event => {
    event.preventDefault();

    const formulaire = event.target;
    const champs = Object.fromEntries(new FormData(formulaire));
    const message = valider(champs, app.candidatures);

    document.querySelector('#erreur').textContent = message;

    if (message !== '') {
        return;
    }

    app.candidatures = ajouter(app.candidatures, champs);
    sauver(app.candidatures);

    formulaire.reset();
    rafraichir();
});

document.querySelector('#liste').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    const id = Number(bouton.dataset.id);

    if (bouton.dataset.action === 'avancer') {
        app.candidatures = avancer(app.candidatures, id);
    }

    if (bouton.dataset.action === 'refuser') {
        app.candidatures = refuser(app.candidatures, id);
    }

    if (bouton.dataset.action === 'supprimer') {
        supprimerCandidature(id);
        return;
    }

    sauver(app.candidatures);
    rafraichir();
});

document.querySelector('#stats').addEventListener('click', event => {
    const bouton = event.target.closest('button[data-statut]');

    if (!bouton) return;

    const statut = bouton.dataset.statut;

    app.statut = app.statut === statut ? null : statut;
    rafraichir();
});

const rechercherDiffere = antiRebond(rafraichir, 300);

document.querySelector('#recherche').addEventListener('input', event => {
    app.recherche = event.target.value;
    rechercherDiffere();
});

document.querySelector('#tri').addEventListener('change', event => {
    app.tri = event.target.value;
    rafraichir();
});

document.querySelector('#annuler-suppression').addEventListener('click', () => {
    if (app.annulation === null) {
        return;
    }

    app.candidatures = retablir(app.candidatures, app.annulation.candidature, app.annulation.index);
    app.annulation = null;

    clearTimeout(minuteurSuppression);
    sauver(app.candidatures);
    rafraichir();
});

rafraichir();
