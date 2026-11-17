const CLE = 'prefs:v1';
const DEFAUTS = { theme: 'clair', taille: 16, notifs: true };

function charger() {
    try {
        const texte = localStorage.getItem(CLE);

        if (texte === null) {
            return { ...DEFAUTS };
        }

        const stocke = JSON.parse(texte);

        if (typeof stocke !== 'object' || stocke === null) {
            console.warn('Préférences invalides, valeurs par défaut utilisées.');
            return { ...DEFAUTS };
        }

        const melange = { ...DEFAUTS, ...stocke };

        return {
            theme: melange.theme === 'sombre' ? 'sombre' : 'clair',
            taille: Math.min(24, Math.max(12, Number(melange.taille) || DEFAUTS.taille)),
            notifs: typeof melange.notifs === 'boolean' ? melange.notifs : DEFAUTS.notifs
        };
    } catch (erreur) {
        console.warn('Préférences illisibles, valeurs par défaut utilisées.');
        return { ...DEFAUTS };
    }
}

function sauver(preferences) {
    try {
        localStorage.setItem(CLE, JSON.stringify(preferences));
    } catch (erreur) {
        console.warn('Impossible d\'enregistrer les préférences.');
    }
}

let prefs = charger();

const theme = document.querySelector('#theme');
const taille = document.querySelector('#taille');
const notifs = document.querySelector('#notifs');
const valeurTaille = document.querySelector('#valeurTaille');
const apercu = document.querySelector('#apercu');

function appliquer() {
    apercu.classList.toggle('sombre', prefs.theme === 'sombre');
    apercu.style.fontSize = prefs.taille + 'px';

    theme.value = prefs.theme;
    taille.value = prefs.taille;
    notifs.checked = prefs.notifs;
    valeurTaille.textContent = prefs.taille + ' px';
}

function lireControles() {
    return {
        theme: theme.value,
        taille: Number(taille.value),
        notifs: notifs.checked
    };
}

function enregistrer() {
    sauver(prefs);
    appliquer();
}

document.querySelector('.carte').addEventListener('input', () => {
    prefs = lireControles();
    enregistrer();
});

document.querySelector('#reset').addEventListener('click', () => {
    prefs = { ...DEFAUTS };
    enregistrer();
});

appliquer();