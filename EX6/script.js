const villes = ['Agadir', 'Casablanca', 'Chefchaouen', 'Essaouira', 'Fès', 'Marrakech', 'Meknès', 'Rabat', 'Tanger', 'Tétouan'];
let appels = 0;

const chercher = (texte) => {
    appels++;
    return villes.filter((ville) => ville.toLowerCase().includes(texte.toLowerCase()));
};

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
        const li = document.createElement('li');
        li.textContent = ville;
        resultats.append(li);
    });

    info.textContent = trouvees.length + ' résultat(s) - ' + appels + ' appel(s)';
}

document.querySelector('#recherche').addEventListener('input', event => {
    afficherResultats(event.target.value.trim());
});
