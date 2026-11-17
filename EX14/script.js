function formater(nombre) {
    return nombre.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function creerChamp(classe, type, valeur) {
    const champ = document.createElement('input');

    champ.type = type;
    champ.className = classe;
    champ.value = valeur;

    if (type === 'number') {
        champ.min = '0';
        champ.step = '0.01';
    }

    return champ;
}

function creerLigne() {
    const ligne = document.createElement('tr');
    const celluleDesignation = document.createElement('td');
    const celluleQte = document.createElement('td');
    const cellulePrix = document.createElement('td');
    const celluleTotal = document.createElement('td');
    const celluleBouton = document.createElement('td');
    const bouton = document.createElement('button');

    celluleDesignation.append(creerChamp('designation', 'text', ''));
    celluleQte.append(creerChamp('qte', 'number', 1));
    cellulePrix.append(creerChamp('prix', 'number', 0));

    celluleTotal.className = 'total-ligne';
    celluleTotal.textContent = formater(0);

    bouton.type = 'button';
    bouton.className = 'supprimer';
    bouton.textContent = '×';
    celluleBouton.append(bouton);

    ligne.append(celluleDesignation, celluleQte, cellulePrix, celluleTotal, celluleBouton);

    return ligne;
}

function lireNombre(champ) {
    const valeur = champ.valueAsNumber;
    const nombre = Number.isFinite(valeur) ? valeur : 0;
    const negatif = nombre < 0;

    champ.classList.toggle('negatif', negatif);

    return negatif ? 0 : nombre;
}

function calculerTotaux() {
    const lignes = [...document.querySelectorAll('#lignes tr')];

    const ht = lignes.reduce((somme, ligne) => {
        const quantite = lireNombre(ligne.querySelector('.qte'));
        const prix = lireNombre(ligne.querySelector('.prix'));
        const total = quantite * prix;

        ligne.querySelector('.total-ligne').textContent = formater(total);

        return somme + total;
    }, 0);

    const tva = ht * 0.2;

    document.querySelector('#ht').textContent = formater(ht);
    document.querySelector('#tva').textContent = formater(tva);
    document.querySelector('#ttc').textContent = formater(ht + tva);
}

document.querySelector('#lignes').append(creerLigne());
calculerTotaux();
