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

function creerBouton(texte, numero, desactive) {
    const bouton = document.createElement('button');

    bouton.type = 'button';
    bouton.textContent = texte;
    bouton.dataset.page = numero;
    bouton.disabled = desactive;
    bouton.classList.toggle('active', numero === page);

    return bouton;
}

function render() {
    const plage = document.querySelector('#plage');
    const liste = document.querySelector('#liste');
    const pages = document.querySelector('#pages');

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

    pages.textContent = '';
    pages.append(creerBouton('Précédent', page - 1, page === 1));

    for (let numero = 1; numero <= total; numero++) {
        pages.append(creerBouton(numero, numero, false));
    }

    pages.append(creerBouton('Suivant', page + 1, page === total));
}

document.querySelector('#pages').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton || bouton.disabled) return;

    page = Number(bouton.dataset.page);

    render();
});

render();
