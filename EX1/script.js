
const etat = {
    filtre: "tous",
    projets: [
        { id: 1, titre: "Portfolio", archive: false },
        { id: 2, titre: "Blog", archive: true },
        { id: 3, titre: "Quiz", archive: false }
    ]
};

function projetsVisibles(etat) {
    if (etat.filtre === "tous") {
        return etat.projets;
    }

    if (etat.filtre === "actifs") {
        return etat.projets.filter(projet => projet.archive === false);
    }

    if (etat.filtre === "archives") {
        return etat.projets.filter(projet => projet.archive === true);
    }

    return [];
}

function render() {
    const liste = document.querySelector("#liste");
    const resume = document.querySelector("#resume");

    liste.textContent = "";

    const projets = projetsVisibles(etat);

    projets.forEach(projet => {
        const li = document.createElement("li");
        li.textContent = projet.titre;
        liste.append(li);
    });

    resume.textContent = `${projets.length} projet(s) sur ${etat.projets.length}`;

    document.querySelectorAll("#onglets button").forEach(button => {
        button.classList.toggle("active", button.dataset.filtre === etat.filtre);
    });
}

document.querySelector("#onglets").addEventListener("click", event => {
    const bouton = event.target.closest("button");

    if (!bouton) return;

    etat.filtre = bouton.dataset.filtre;

    render();
});

render();