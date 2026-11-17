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

document.querySelector('#liste').addEventListener('dblclick', event => {
    const span = event.target.closest('span[data-id]');

    if (!span) return;

    const input = document.createElement('input');
    let terminee = false;

    input.type = 'text';
    input.className = 'edition';
    input.value = span.textContent;

    function terminer(valider) {
        if (terminee) return;

        terminee = true;

        const texte = input.value.trim();

        if (valider && texte !== '') {
            const id = Number(span.dataset.id);

            elements = elements.map(element => {
                if (element.id === id) {
                    return { ...element, texte: texte };
                }

                return element;
            });

            render();
            return;
        }

        input.replaceWith(span);
    }

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            terminer(true);
        }

        if (event.key === 'Escape') {
            terminer(false);
        }
    });

    input.addEventListener('blur', () => terminer(true));

    span.replaceWith(input);
    input.focus();
    input.select();
});

render();
