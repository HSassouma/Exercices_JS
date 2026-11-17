let elements = [
    { id: 1, texte: 'Préparer la démo' },
    { id: 2, texte: 'Relire la PR' },
    { id: 3, texte: 'Mettre à jour le README' }
];

function render() {
    const liste = document.querySelector('#liste');

    liste.textContent = '';

    elements.forEach(element => {
        const li = document.createElement('li');
        const span = document.createElement('span');

        span.dataset.id = element.id;
        span.textContent = element.texte;

        li.append(span);
        liste.append(li);
    });
}

render();
