let produits = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, nom: 'Produit ' + (i + 1) }));
const PAR_PAGE = 5;
let page = 1;

function pageCourante(donnees, numero, parPage) {
    const debut = (numero - 1) * parPage;
    return donnees.slice(debut, debut + parPage);
}

function nombreDePages(donnees, parPage) {
    return Math.ceil(donnees.length / parPage);
}

function render() {
    const plage = document.querySelector('#plage');
    const liste = document.querySelector('#liste');

    const total = nombreDePages(produits, PAR_PAGE);
    page = Math.min(Math.max(page, 1), total);

    const affiches = pageCourante(produits, page, PAR_PAGE);
    const debut = (page - 1) * PAR_PAGE + 1;
    const fin = debut + affiches.length - 1;

    liste.textContent = '';

    affiches.forEach(produit => {
        const li = document.createElement('li');
        li.textContent = produit.nom;
        liste.append(li);
    });

    plage.textContent = 'Éléments ' + debut + '-' + fin + ' sur ' + produits.length;
}

render();
