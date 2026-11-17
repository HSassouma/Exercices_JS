const CONFIG = {
    succes: { couleur: '#15803d' },
    erreur: { couleur: '#b91c1c' },
    info: { couleur: '#1d4ed8' }
};

const MAX_VISIBLES = 3;

let visibles = [];
let file = [];
let prochainId = 1;

function afficherAttente() {
    const attente = document.querySelector('#attente');

    attente.textContent = file.length > 0 ? '+' + file.length + ' en attente' : '';
}

function afficherSuivante() {
    while (visibles.length < MAX_VISIBLES && file.length > 0) {
        afficher(file.shift());
    }

    afficherAttente();
}

function fermer(id) {
    const index = visibles.findIndex(notification => notification.id === id);

    if (index === -1) {
        return;
    }

    clearTimeout(visibles[index].minuteur);
    visibles[index].element.remove();
    visibles.splice(index, 1);

    afficherSuivante();
}

function afficher(notification) {
    const zone = document.querySelector('#toasts');
    const element = document.createElement('div');
    const texte = document.createElement('span');
    const bouton = document.createElement('button');
    const configuration = CONFIG[notification.type] || CONFIG.info;

    element.className = 'toast';
    element.dataset.id = notification.id;
    element.style.backgroundColor = configuration.couleur;

    texte.textContent = notification.message;

    bouton.type = 'button';
    bouton.textContent = '×';

    element.append(texte, bouton);
    zone.append(element);

    element.addEventListener('mouseenter', () => {
        clearTimeout(notification.minuteur);
        notification.reste = Math.max(0, notification.reste - (Date.now() - notification.debut));
    });

    element.addEventListener('mouseleave', () => {
        demarrer(notification);
    });

    notification.element = element;
    visibles.push(notification);

    demarrer(notification);
}

function demarrer(notification) {
    notification.debut = Date.now();

    notification.minuteur = setTimeout(() => {
        fermer(notification.id);
    }, notification.reste);
}

function notifier(message, type, duree = 3000) {
    const notification = {
        id: prochainId,
        message: message,
        type: type,
        reste: duree,
        element: null,
        minuteur: null,
        debut: 0
    };

    prochainId++;

    if (visibles.length >= MAX_VISIBLES) {
        file.push(notification);
        afficherAttente();
        return;
    }

    afficher(notification);
}

document.querySelector('#toasts').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    fermer(Number(bouton.closest('.toast').dataset.id));
});

document.querySelector('.boutons').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    notifier('Notification de type ' + bouton.dataset.type, bouton.dataset.type);
});

window.notifier = notifier;
