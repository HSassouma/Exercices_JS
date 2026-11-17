const equipes = [
    { nom: 'Atlas', ville: 'Fès', score: 42 },
    { nom: 'Zénith', ville: 'Agadir', score: 57 },
    { nom: 'Écho', ville: 'Tanger', score: 42 },
    { nom: 'Delta', ville: 'Oujda', score: 13 }
];

let tri = { cle: 'nom', sens: 1 };

function comparer(a, b, cle) {
    if (typeof a[cle] === 'number') {
        return a[cle] - b[cle];
    }

    return String(a[cle]).localeCompare(String(b[cle]), 'fr');
}

function trier(donnees, cle, sens) {
    return [...donnees].sort((a, b) => {
        const resultat = comparer(a, b, cle) * sens;

        if (resultat !== 0) {
            return resultat;
        }

        return a.nom.localeCompare(b.nom, 'fr');
    });
}

function render() {
    const corps = document.querySelector('#corps');
    const lignes = trier(equipes, tri.cle, tri.sens);

    corps.textContent = '';

    lignes.forEach(equipe => {
        const tr = document.createElement('tr');

        Object.values(equipe).forEach(valeur => {
            const td = document.createElement('td');
            td.textContent = valeur;
            tr.append(td);
        });

        corps.append(tr);
    });

    document.querySelectorAll('#entetes th').forEach(th => {
        th.classList.toggle('actif', th.dataset.cle === tri.cle);
        th.querySelector('.fleche').textContent = th.dataset.cle === tri.cle ? (tri.sens === 1 ? '▲' : '▼') : '';
    });
}

document.querySelector('#entetes').addEventListener('click', event => {
    const th = event.target.closest('th');

    if (!th) return;

    const cle = th.dataset.cle;

    if (cle === tri.cle) {
        tri = { cle: cle, sens: -tri.sens };
    } else {
        tri = { cle: cle, sens: 1 };
    }

    render();
});

render();
