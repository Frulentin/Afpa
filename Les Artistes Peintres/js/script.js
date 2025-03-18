// peintures des galeries
const galeries = {
    picasso: [
        "img/Demoiselles_Avignon.png",
        "img/Femme_qui_pleure.png",
        "img/guernica.png",
        "img/Marie_Therese.png",
        "img/Autoportrait_Picasso.png",
        "img/Le_Peintre_et_son_Modele.png"
    ],
    caillebotte: [
        "img/Autoportrait_Caillebotte.png",
        "img/Peintres_en_batiment.png",
        "img/Jour_de_pluie_à_Paris.png",
        "img/Périssoires_sur_lYerres.png",
        "img/Raboteurs_de_parquet.png",
    ],
    vermeer: [
        "img/fille_a_la-perle.png",
        "img/La_Laitière.png",
        "img/La_Liseuse_à_la_fenêtre.png"
    ],
    kandinsky: [
        "img/Noir-et-violet-1923.png",
        "img/Jaune_rouge_bleu.png",
        "img/Moscou-1916.png",
        "img/Composition-1939.png",
        "img/tableau-en-bleu-1925-.png",
        "img/Composition-VI-1913.png"
    ],
    monet: [
        "img/Impression_soleil_levant-1872.png",
        "img/Les_Coquelicots.png",
        "img/Madame_Monet_et_Enfant-1875.png",
        "img/Le_déjeuner-1873.png",
        "img/La_Promenade.png",
        "img/Nymphéas-1916.png"
    ],
    vangogh: [
        "img/Campagne_Montagneuse-1889.jpg",
        "img/La_Chambre_de_van_gogh-1889-.png",
        "img/La_nuit_étoilée-1889.png",
        "img/La_Sieste.png",
        "img/Les_Iris-1889.png",
        "img/Terrasse_café.png"
    ]
};

function afficherGalerie(peintre) {
    const galerieImages = document.querySelector(".galerie-images");
    const titreGalerie = document.getElementById("titre-galerie");

    // Vide la galerie actuelle
    galerieImages.innerHTML = "";

    // Met à jour le titre de la galerie
    titreGalerie.textContent = `Galerie ${peintre.charAt(0).toUpperCase() + peintre.slice(1)}`;

    // Ajoute les images de la galerie
    galeries[peintre].forEach(imageUrl => {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Oeuvre de ${peintre}`;
        img.classList.add("galerie-image");

        // Ajoute un écouteur pour vérifier si l'image est chargée
        img.onload = () => console.log(`Image chargée : ${imageUrl}`);
        img.onerror = () => console.error(`Erreur de chargement : ${imageUrl}`);

        galerieImages.appendChild(img);
    });
}

// Ajouter des écouteurs d'événements aux liens des peintres
document.querySelectorAll("nav ul li a").forEach(lien => {
    lien.addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        const peintre = this.getAttribute("href").replace(".html", ""); // Récupère le nom du peintre
        afficherGalerie(peintre); // Affiche la galerie correspondante
    });
});