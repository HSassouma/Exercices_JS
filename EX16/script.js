const panier = [
    { nom: 'Clavier', prix: 250, qte: 1, categorie: 'info' },
    { nom: 'Câble', prix: 35, qte: 3, categorie: 'info' },
    { nom: 'Lampe', prix: 180, qte: 1, categorie: 'maison' }
];

const codes = [
    { code: 'BIENVENUE', type: 'pourcent', valeur: 10 },
    { code: 'INFO50', type: 'fixe', valeur: 50, categorie: 'info' },
    { code: 'LIVRAISON', type: 'livraison' }
];

const LIVRAISON = 30;
const SEUIL_LIVRAISON = 500;

function arrondir(montant) {
    return Math.round(montant * 100) / 100;
}

function sousTotal(panier) {
    return arrondir(panier.reduce((somme, article) => somme + article.prix * article.qte, 0));
}

function montantDuCode(panier, code) {
    if (code.type === 'pourcent') {
        return sousTotal(panier) * code.valeur / 100;
    }

    if (code.type === 'fixe') {
        const montantCategorie = panier
            .filter(article => article.categorie === code.categorie)
            .reduce((somme, article) => somme + article.prix * article.qte, 0);

        return Math.min(code.valeur, montantCategorie);
    }

    return 0;
}

function remise(panier, codesAppliques) {
    const somme = codesAppliques.reduce((total, code) => total + montantDuCode(panier, code), 0);

    return arrondir(Math.min(somme, sousTotal(panier)));
}

function fraisLivraison(panier, codesAppliques) {
    const livraisonOfferte = codesAppliques.some(code => code.type === 'livraison');
    const resteAPayer = sousTotal(panier) - remise(panier, codesAppliques);

    if (livraisonOfferte || resteAPayer >= SEUIL_LIVRAISON) {
        return 0;
    }

    return LIVRAISON;
}

function total(panier, codesAppliques) {
    const apresRemise = sousTotal(panier) - remise(panier, codesAppliques);

    return arrondir(apresRemise + fraisLivraison(panier, codesAppliques));
}

console.assert(sousTotal(panier) === 535, 'Le sous-total doit valoir 535 DH');
console.assert(total(panier, []) === 535, 'Sans code, le total doit valoir 535 DH');
console.assert(fraisLivraison(panier, []) === 0, 'La livraison est offerte dès 500 DH');
console.assert(total(panier, [codes[0]]) === 511.5, 'BIENVENUE doit donner 511,50 DH');
console.assert(fraisLivraison(panier, [codes[0]]) === 30, 'La livraison coûte 30 DH après remise');
console.assert(remise(panier, [codes[1]]) === 50, 'INFO50 retire 50 DH sur la catégorie info');
console.assert(total(panier, [codes[1]]) === 515, 'INFO50 doit donner 515 DH');
console.assert(total(panier, [codes[2]]) === 535, 'LIVRAISON ne change pas le total au-dessus du seuil');
console.assert(remise(panier, [{ type: 'fixe', valeur: 900, categorie: 'info' }]) === 355, 'Une remise fixe ne dépasse pas le montant de sa catégorie');

let codesAppliques = [];

function formater(montant) {
    return montant.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' DH';
}

function trouverCode(texte) {
    const cherche = texte.trim().toUpperCase();

    return codes.find(code => code.code === cherche);
}

function afficherMessage(texte, succes) {
    const message = document.querySelector('#message');

    message.textContent = texte;
    message.classList.toggle('succes', succes);
}

function render() {
    const articles = document.querySelector('#articles');
    const remises = document.querySelector('#remises');
    const livraison = fraisLivraison(panier, codesAppliques);

    articles.textContent = '';

    panier.forEach(article => {
        const li = document.createElement('li');
        const nom = document.createElement('span');
        const prix = document.createElement('span');

        nom.textContent = article.nom + ' × ' + article.qte;
        prix.className = 'prix';
        prix.textContent = formater(article.prix * article.qte);

        li.append(nom, prix);
        articles.append(li);
    });

    remises.textContent = '';

    codesAppliques.forEach(code => {
        const ligne = document.createElement('p');
        const texte = document.createElement('span');
        const bouton = document.createElement('button');

        ligne.className = 'remise';
        texte.textContent = code.type === 'livraison'
            ? code.code + ' : livraison offerte'
            : code.code + ' : -' + formater(montantDuCode(panier, code));

        bouton.type = 'button';
        bouton.dataset.code = code.code;
        bouton.textContent = 'Retirer';

        ligne.append(texte, bouton);
        remises.append(ligne);
    });

    document.querySelector('#sous-total').textContent = formater(sousTotal(panier));
    document.querySelector('#livraison').textContent = livraison === 0 ? 'Offerte' : formater(livraison);
    document.querySelector('#total').textContent = formater(total(panier, codesAppliques));
}

document.querySelector('#promo').addEventListener('submit', event => {
    event.preventDefault();

    const champ = document.querySelector('#code');
    const texte = champ.value.trim();

    if (texte === '') {
        afficherMessage('Saisis un code promo.', false);
        return;
    }

    const code = trouverCode(texte);

    if (code === undefined) {
        afficherMessage('Code inconnu.', false);
        return;
    }

    if (codesAppliques.some(applique => applique.code === code.code)) {
        afficherMessage('Ce code est déjà appliqué.', false);
        return;
    }

    if (codesAppliques.length >= 2) {
        afficherMessage('Deux codes au maximum.', false);
        return;
    }

    codesAppliques = [...codesAppliques, code];
    champ.value = '';

    afficherMessage('Code ' + code.code + ' appliqué.', true);
    render();
});

document.querySelector('#remises').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    codesAppliques = codesAppliques.filter(code => code.code !== bouton.dataset.code);

    afficherMessage('Code retiré.', true);
    render();
});

render();