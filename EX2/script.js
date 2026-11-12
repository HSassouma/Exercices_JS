
'use strict';

let panier = Object.freeze([
    Object.freeze({ id: 1, nom: 'Clavier', prix: 250, qte: 1 }),
    Object.freeze({ id: 2, nom: 'Souris', prix: 90, qte: 2 })
]);

function incrementer(panier, id) {
    return panier.map(produit => {
        if (produit.id === id) {
            return { ...produit, qte: produit.qte + 1 };
        }

        return produit;
    });
}

function decrementer(panier, id) {
    return panier
        .map(produit => {
            if (produit.id === id) {
                return { ...produit, qte: produit.qte - 1 };
            }

            return produit;
        })
        .filter(produit => produit.qte > 0);
}

function ajouter(panier, produit) {
    const existe = panier.some(p => p.id === produit.id);

    if (existe) {
        return incrementer(panier, produit.id);
    }

    return [...panier, { ...produit }];
}

function render() {
    const liste = document.querySelector('#panier');
    const totalElement = document.querySelector('#total');

    liste.textContent = '';

    panier.forEach(produit => {
        const li = document.createElement('li');

        li.className = 'produit';

        li.innerHTML = `
            <span>${produit.nom} - ${produit.prix} DH</span>
            <div>
                <button data-action="moins" data-id="${produit.id}">-</button>
                <span>${produit.qte}</span>
                <button data-action="plus" data-id="${produit.id}">+</button>
            </div>
        `;

        liste.append(li);
    });

    const somme = panier.reduce((total, produit) => {
        return total + produit.prix * produit.qte;
    }, 0);

    totalElement.textContent = `Total : ${somme} DH`;
}

document.querySelector('#panier').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    const id = Number(bouton.dataset.id);

    if (bouton.dataset.action === 'plus') {
        panier = incrementer(panier, id);
    }

    if (bouton.dataset.action === 'moins') {
        panier = decrementer(panier, id);
    }

    render();
});


render();
