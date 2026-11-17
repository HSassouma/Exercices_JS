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
            taille: Number(melange.taille) || DEFAUTS.taille,
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
