const depenses = [
    { libelle: 'Marché', categorie: 'Courses', montant: 320 },
    { libelle: 'Bus', categorie: 'Transport', montant: 60 },
    { libelle: 'Cinéma', categorie: 'Loisirs', montant: 90 },
    { libelle: 'Épicerie', categorie: 'Courses', montant: 140 },
    { libelle: 'Taxi', categorie: 'Transport', montant: 85 }
];

function regrouper(depenses) {
    return depenses.reduce((totaux, depense) => {
        totaux[depense.categorie] = (totaux[depense.categorie] || 0) + depense.montant;
        return totaux;
    }, {});
}

function trierParMontant(totaux) {
    return Object.entries(totaux).sort((a, b) => b[1] - a[1]);
}

function calculerTotal(totaux) {
    return Object.values(totaux).reduce((total, montant) => total + montant, 0);
}

function render() {
    const graphique = document.querySelector('#graphique');
    const total = document.querySelector('#total');
    const totaux = regrouper(depenses);
    const paires = trierParMontant(totaux);
    const maximum = Math.max(...paires.map(paire => paire[1]));

    graphique.textContent = '';

    paires.forEach(([categorie, montant]) => {
        const ligne = document.createElement('div');
        const nom = document.createElement('span');
        const piste = document.createElement('div');
        const barre = document.createElement('div');
        const valeur = document.createElement('span');

        ligne.className = 'ligne';
        nom.className = 'categorie';
        piste.className = 'piste';
        barre.className = 'barre';
        valeur.className = 'montant';

        nom.textContent = categorie;
        barre.style.width = (montant / maximum) * 100 + '%';
        valeur.textContent = montant + ' DH';

        piste.append(barre);
        ligne.append(nom, piste, valeur);
        graphique.append(ligne);
    });

    total.textContent = 'Total : ' + calculerTotal(totaux) + ' DH';
}

render();
