const CLE = 'candidatures:v1';

export const STATUTS = ['envoyee', 'entretien', 'offre', 'refusee'];

export function genererId(candidatures) {
    return candidatures.reduce((maximum, candidature) => Math.max(maximum, candidature.id), 0) + 1;
}

export function charger() {
    try {
        const texte = localStorage.getItem(CLE);

        if (texte === null) {
            return [];
        }

        const donnees = JSON.parse(texte);

        if (!Array.isArray(donnees)) {
            return [];
        }

        return donnees.filter(candidature => {
            return candidature
                && typeof candidature.entreprise === 'string'
                && typeof candidature.poste === 'string'
                && typeof candidature.contact === 'string'
                && STATUTS.includes(candidature.statut);
        });
    } catch (erreur) {
        console.warn('Candidatures illisibles, on repart d\'une liste vide.');
        return [];
    }
}

export function sauver(candidatures) {
    try {
        localStorage.setItem(CLE, JSON.stringify(candidatures));
    } catch (erreur) {
        console.warn('Impossible d\'enregistrer les candidatures.');
    }
}

export function valider(candidature, candidatures) {
    if (candidature.entreprise.trim() === '') {
        return 'L\'entreprise est obligatoire.';
    }

    if (candidature.poste.trim() === '') {
        return 'Le poste est obligatoire.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(candidature.contact.trim())) {
        return 'L\'email du contact est invalide.';
    }

    const doublon = candidatures.some(autre => {
        return autre.entreprise.trim().toLowerCase() === candidature.entreprise.trim().toLowerCase()
            && autre.poste.trim().toLowerCase() === candidature.poste.trim().toLowerCase();
    });

    if (doublon) {
        return 'Cette candidature existe déjà.';
    }

    return '';
}

export function ajouter(candidatures, candidature) {
    return [
        ...candidatures,
        {
            id: genererId(candidatures),
            entreprise: candidature.entreprise.trim(),
            poste: candidature.poste.trim(),
            contact: candidature.contact.trim(),
            statut: 'envoyee',
            date: Date.now()
        }
    ];
}

export function avancer(candidatures, id) {
    return candidatures.map(candidature => {
        if (candidature.id !== id) {
            return candidature;
        }

        if (candidature.statut === 'envoyee') {
            return { ...candidature, statut: 'entretien' };
        }

        if (candidature.statut === 'entretien') {
            return { ...candidature, statut: 'offre' };
        }

        return candidature;
    });
}

export function refuser(candidatures, id) {
    return candidatures.map(candidature => {
        if (candidature.id !== id) {
            return candidature;
        }

        return { ...candidature, statut: 'refusee' };
    });
}

export function supprimer(candidatures, id) {
    return candidatures.filter(candidature => candidature.id !== id);
}

export function retablir(candidatures, candidature, index) {
    return [
        ...candidatures.slice(0, index),
        candidature,
        ...candidatures.slice(index)
    ];
}

export function filtrer(candidatures, statut, texte) {
    const cherche = texte.trim().toLowerCase();

    return candidatures
        .filter(candidature => statut === null || candidature.statut === statut)
        .filter(candidature => {
            if (cherche === '') {
                return true;
            }

            const contenu = (candidature.entreprise + ' ' + candidature.poste + ' ' + candidature.contact).toLowerCase();

            return contenu.includes(cherche);
        });
}

export function trier(candidatures, tri) {
    return [...candidatures].sort((a, b) => {
        if (tri === 'entreprise') {
            return a.entreprise.localeCompare(b.entreprise, 'fr');
        }

        return b.date - a.date;
    });
}

export function statistiques(candidatures) {
    const compteurs = candidatures.reduce((totaux, candidature) => {
        totaux[candidature.statut] = totaux[candidature.statut] + 1;
        return totaux;
    }, Object.fromEntries(STATUTS.map(statut => [statut, 0])));

    const total = candidatures.length;
    const reponses = total - compteurs.envoyee;
    const taux = total === 0 ? 0 : Math.round((reponses / total) * 100);

    return { ...compteurs, total: total, taux: taux };
}

export default charger;
