const articles = [
    { nom: 'Le Petit Prince', categorie: 'livre', prix: 80, stock: true },
    { nom: 'Clean Code', categorie: 'livre', prix: 320, stock: true },
    { nom: 'Les Misérables', categorie: 'livre', prix: 150, stock: false },
    { nom: 'L’Étranger', categorie: 'livre', prix: 95, stock: true },
    { nom: 'Catan', categorie: 'jeu', prix: 350, stock: true },
    { nom: 'Dixit', categorie: 'jeu', prix: 280, stock: false },
    { nom: 'Uno', categorie: 'jeu', prix: 60, stock: true },
    { nom: 'Échecs', categorie: 'jeu', prix: 190, stock: true },
    { nom: 'Vinyle Jazz', categorie: 'musique', prix: 220, stock: true },
    { nom: 'Album Chaabi', categorie: 'musique', prix: 140, stock: false },
    { nom: 'Gnaoua Live', categorie: 'musique', prix: 180, stock: true },
    { nom: 'Vinyle Soul', categorie: 'musique', prix: 260, stock: true },
    { nom: 'Casque audio', categorie: 'musique', prix: 480, stock: true }
];

function lireCriteres(formulaire) {
    const categories = [...formulaire.querySelectorAll('[name="cat"]:checked')].map(caseACocher => caseACocher.value);
    const prixMax = formulaire.elements.max.value;

    return {
        texte: formulaire.elements.q.value.trim().toLowerCase(),
        categories: categories,
        max: prixMax === '' ? null : Number(prixMax),
        stock: formulaire.elements.stock.checked
    };
}

function construirePredicats(criteres) {
    const predicats = [];

    if (criteres.texte !== '') {
        predicats.push(article => article.nom.toLowerCase().includes(criteres.texte));
    }

    if (criteres.categories.length > 0) {
        predicats.push(article => criteres.categories.includes(article.categorie));
    }

    if (criteres.max !== null) {
        predicats.push(article => article.prix <= criteres.max);
    }

    if (criteres.stock) {
        predicats.push(article => article.stock);
    }

    return predicats;
}

function filtrer(articles, predicats) {
    return articles.filter(article => predicats.every(predicat => predicat(article)));
}

function render() {
    const formulaire = document.querySelector('#filtres');
    const liste = document.querySelector('#resultats');
    const compte = document.querySelector('#compte');

    const criteres = lireCriteres(formulaire);
    const visibles = filtrer(articles, construirePredicats(criteres));

    liste.textContent = '';
    compte.textContent = visibles.length + ' résultat(s)';

    visibles.forEach(article => {
        const li = document.createElement('li');
        const nom = document.createElement('span');
        const categorie = document.createElement('span');
        const prix = document.createElement('span');

        nom.textContent = article.nom;
        categorie.className = 'categorie';
        categorie.textContent = article.categorie;
        prix.className = 'prix';
        prix.textContent = article.prix + ' DH';

        if (!article.stock) {
            const rupture = document.createElement('span');
            rupture.className = 'rupture';
            rupture.textContent = 'rupture';
            nom.append(' ');
            nom.append(rupture);
        }

        li.append(nom, categorie, prix);
        liste.append(li);
    });
}

render();
