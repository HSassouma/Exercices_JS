const villes = ['Agadir', 'Casablanca', 'Chefchaouen', 'Essaouira', 'Fès', 'Marrakech', 'Meknès', 'Rabat', 'Tanger', 'Tétouan'];
let appels = 0;

const chercher = (texte) => {
    appels++;
    return villes.filter((ville) => ville.toLowerCase().includes(texte.toLowerCase()));
};

function antiRebond(fonction, delai) {
    let minuteur;

    return (...valeurs) => {
        clearTimeout(minuteur);
        minuteur = setTimeout(() => fonction(...valeurs), delai);
    };
}

function creerLigne(ville, texte) {
    const li = document.createElement('li');
    const position = ville.toLowerCase().indexOf(texte.toLowerCase());

    if (position === -1) {
        li.textContent = ville;
        return li;
    }

    const avant = document.createElement('span');
    const trouve = document.createElement('strong');
    const apres = document.createElement('span');

    avant.textContent = ville.slice(0, position);
    trouve.textContent = ville.slice(position, position + texte.length);
    apres.textContent = ville.slice(position + texte.length);

    li.append(avant, trouve, apres);

    return li;
}

function afficherResultats(texte) {
    const info = document.querySelector('#info');
    const resultats = document.querySelector('#resultats');

    resultats.textContent = '';

    if (texte === '') {
        info.textContent = 'Aucune recherche';
        return;
    }

    const trouvees = chercher(texte);

    trouvees.forEach(ville => {
        resultats.append(creerLigne(ville, texte));
    });

    if (trouvees.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Aucune ville ne correspond à ' + texte;
        resultats.append(li);
    }

    info.textContent = trouvees.length + ' résultat(s) - ' + appels + ' appel(s)';
}

const lancerRecherche = antiRebond(texte => {
    afficherResultats(texte);
}, 300);

document.querySelector('#recherche').addEventListener('input', event => {
    const texte = event.target.value.trim();

    document.querySelector('#info').textContent = texte === '' ? 'Aucune recherche' : 'Recherche...';

    lancerRecherche(texte);
});
