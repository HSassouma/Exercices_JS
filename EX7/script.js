const regles = {
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
        message: 'Email invalide, exemple : nom@domaine.com'
    },
    telephone: {
        regex: /^0[67]\d{8}$/,
        message: 'Téléphone invalide, il doit commencer par 06 ou 07 et contenir 8 chiffres'
    },
    motdepasse: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        message: 'Mot de passe invalide : 8 caractères, une majuscule, une minuscule et un chiffre'
    }
};

function nettoyer(nom, valeur) {
    if (nom === 'telephone') {
        return valeur.replace(/\s/g, '');
    }

    return valeur;
}

function valider(nom, valeur) {
    const regle = regles[nom];
    const texte = nettoyer(nom, valeur);

    if (regle.regex.test(texte)) {
        return '';
    }

    return regle.message;
}

function champsValides(formulaire) {
    return Object.keys(regles).every(nom => {
        return valider(nom, formulaire.elements[nom].value) === '';
    });
}

const formulaire = document.querySelector('#inscription');
const bouton = formulaire.querySelector('button');
const succes = document.querySelector('#succes');

formulaire.addEventListener('submit', event => {
    event.preventDefault();

    const valide = champsValides(formulaire);

    if (!valide) {
        return;
    }

    succes.textContent = 'Compte créé';
    formulaire.reset();

    Object.keys(regles).forEach(nom => {
        formulaire.elements[nom].classList.remove('valide', 'invalide');
        formulaire.querySelector('[data-erreur="' + nom + '"]').textContent = '';
    });

    bouton.disabled = true;
});
