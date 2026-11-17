import { STATUTS, statistiques } from './etat.js';

const LIBELLES = {
    envoyee: 'Envoyée',
    entretien: 'Entretien',
    offre: 'Offre',
    refusee: 'Refusée'
};

function creerBlocStat(valeur, libelle, statut, actif) {
    const bloc = document.createElement(statut === null ? 'div' : 'button');

    bloc.className = 'stat';

    if (statut !== null) {
        bloc.type = 'button';
        bloc.dataset.statut = statut;
        bloc.classList.toggle('active', actif);
    }

    const nombre = document.createElement('span');
    const texte = document.createElement('span');

    nombre.className = 'valeur';
    nombre.textContent = valeur;
    texte.className = 'libelle';
    texte.textContent = libelle;

    bloc.append(nombre, texte);

    return bloc;
}

function afficherStats(app) {
    const stats = document.querySelector('#stats');
    const compteurs = statistiques(app.candidatures);

    stats.textContent = '';

    STATUTS.forEach(statut => {
        stats.append(creerBlocStat(compteurs[statut], LIBELLES[statut], statut, app.statut === statut));
    });

    stats.append(creerBlocStat(compteurs.total, 'Total', null, false));
    stats.append(creerBlocStat(compteurs.taux + ' %', 'Taux de réponse', null, false));
}

function creerAction(texte, action, id, classe) {
    const bouton = document.createElement('button');

    bouton.type = 'button';
    bouton.dataset.action = action;
    bouton.dataset.id = id;
    bouton.textContent = texte;

    if (classe) {
        bouton.className = classe;
    }

    return bouton;
}

function creerCarte(candidature) {
    const li = document.createElement('li');
    const infos = document.createElement('div');
    const entreprise = document.createElement('span');
    const poste = document.createElement('span');
    const contact = document.createElement('span');
    const badge = document.createElement('span');
    const actions = document.createElement('div');

    infos.className = 'infos';
    entreprise.className = 'entreprise';
    poste.className = 'poste';
    contact.className = 'contact';

    entreprise.textContent = candidature.entreprise;
    poste.textContent = candidature.poste;
    contact.textContent = candidature.contact;

    infos.append(entreprise, poste, contact);

    badge.className = 'badge ' + candidature.statut;
    badge.textContent = LIBELLES[candidature.statut];

    actions.className = 'actions';

    if (candidature.statut === 'envoyee' || candidature.statut === 'entretien') {
        actions.append(creerAction('Avancer', 'avancer', candidature.id));
    }

    if (candidature.statut !== 'refusee') {
        actions.append(creerAction('Refuser', 'refuser', candidature.id));
    }

    actions.append(creerAction('Supprimer', 'supprimer', candidature.id, 'supprimer'));

    li.append(infos, badge, actions);

    return li;
}

function afficherAnnulation(app) {
    const bandeau = document.querySelector('#annulation');
    const texte = document.querySelector('#annulation-texte');

    bandeau.classList.toggle('cache', app.annulation === null);

    if (app.annulation !== null) {
        texte.textContent = 'Candidature chez ' + app.annulation.candidature.entreprise + ' supprimée.';
    }
}

export function render(app, visibles) {
    const liste = document.querySelector('#liste');
    const compte = document.querySelector('#compte');
    const vide = document.querySelector('#vide');

    afficherStats(app);

    liste.textContent = '';

    visibles.forEach(candidature => {
        liste.append(creerCarte(candidature));
    });

    compte.textContent = visibles.length + ' candidature(s) affichée(s) sur ' + app.candidatures.length;
    vide.classList.toggle('cache', app.candidatures.length > 0);
    afficherAnnulation(app);
}

export default render;
