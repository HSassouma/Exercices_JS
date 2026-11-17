let historique = { passe: [], present: [], futur: [] };
let prochainId = 1;

function appliquer(historique, etat) {
    return {
        passe: [...historique.passe, historique.present].slice(-20),
        present: etat,
        futur: []
    };
}

function annuler(historique) {
    if (historique.passe.length === 0) {
        return historique;
    }

    const precedent = historique.passe[historique.passe.length - 1];

    return {
        passe: historique.passe.slice(0, -1),
        present: precedent,
        futur: [historique.present, ...historique.futur]
    };
}

function retablir(historique) {
    if (historique.futur.length === 0) {
        return historique;
    }

    return {
        passe: [...historique.passe, historique.present],
        present: historique.futur[0],
        futur: historique.futur.slice(1)
    };
}

function render() {
    const liste = document.querySelector('#liste');
    const vide = document.querySelector('#vide');

    liste.textContent = '';

    historique.present.forEach(element => {
        const li = document.createElement('li');
        const texte = document.createElement('span');
        const bouton = document.createElement('button');

        texte.textContent = element.texte;
        bouton.type = 'button';
        bouton.dataset.id = element.id;
        bouton.textContent = '×';

        li.append(texte, bouton);
        liste.append(li);
    });

    vide.style.display = historique.present.length === 0 ? 'block' : 'none';

    document.querySelector('#annuler').disabled = historique.passe.length === 0;
    document.querySelector('#retablir').disabled = historique.futur.length === 0;
}

document.querySelector('#form').addEventListener('submit', event => {
    event.preventDefault();

    const champ = document.querySelector('#texte');
    const texte = champ.value.trim();

    if (texte === '') return;

    const element = { id: prochainId, texte: texte };

    prochainId++;
    historique = appliquer(historique, [...historique.present, element]);
    render();

    champ.value = '';
});

document.querySelector('#liste').addEventListener('click', event => {
    const bouton = event.target.closest('button');

    if (!bouton) return;

    const id = Number(bouton.dataset.id);
    const restants = historique.present.filter(element => element.id !== id);

    historique = appliquer(historique, restants);
    render();
});

document.querySelector('#annuler').addEventListener('click', () => {
    historique = annuler(historique);
    render();
});

document.querySelector('#retablir').addEventListener('click', () => {
    historique = retablir(historique);
    render();
});

document.addEventListener('keydown', event => {
    if (!event.ctrlKey) return;
    if (event.target.tagName === 'INPUT') return;

    if (event.key === 'z') {
        event.preventDefault();
        historique = annuler(historique);
        render();
    }

    if (event.key === 'y') {
        event.preventDefault();
        historique = retablir(historique);
        render();
    }
});

render();
