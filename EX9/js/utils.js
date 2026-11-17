export function genererId(elements) {
    return Math.max(0, ...elements.map(element => element.id)) + 1;
}

export function antiRebond(fonction, delai) {
    let minuteur;

    return (...valeurs) => {
        clearTimeout(minuteur);
        minuteur = setTimeout(() => fonction(...valeurs), delai);
    };
}

export default antiRebond;
