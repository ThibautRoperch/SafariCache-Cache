
let layer = document.getElementsByTagName("layer")[0];
let popup = document.getElementById("popup");

function display_popup(emoji, message) {
    popup.className = "normal";
    popup.children[0].innerHTML = emoji;
    popup.children[1].innerHTML = message;
    popup.children[2].innerHTML = "Nouveau défi";
    layer.className = "displayed";
}

function hide_popup() {
    layer.className = "hidden";
}

function display_rules() {
    popup.className = "big";

    popup.children[0].innerHTML = "📏 🎮";

    var message = "Le but du jeu est de couvrir, au moyen de 4 pièces prédéfinies, un certain nombre de dessins répartis sur les 4 zones du plateau. L'objectif donné par le jeu est le nombre de dessins devant être visibles.";
    message += "<br>";
    message += "<br>";
    message += "Notre interface graphique permet de joueur à 169 défis. Les défis disponibles sont les problèmes pour lesquels il existe une et une seule solution.";
    message += "<br>";
    message += "<br>";
    message += "La résolution d'un défi, aléatoirement donné, est chronometrée. Le meilleur score de chaque défi, en terme de temps, est sauvegardé pour la session et affiché.";
    message += "<br>";
    message += "<br>";
    message += "⭯ permet de remettre les pièces à leur position initiale."
    message += "<br>";
    message += "💡 permet de donner un indice sur les pièces actuellement placées sur le plateau, le résultat devant être interprété comme suit :";
    message += "<ul>";
    message += "<li>Une pièce mal placée aura un fond rouge";
    message += "<li>Une pièce correctement placée mais mal tournée aura un fond orange";
    message += "<li>Une pièce correctement placée et correctement tournée aura un fond vert";
    message += "</ul>";
    message += "Cependant, utiliser un indice ajoute 60 secondes au chronomètre.";
    message += "<br>";
    message += "<br>";
    message += "Notre interface propose également de passer le défi actuel et de le résoudre automatiquement.";

    popup.children[1].innerHTML = message;
    popup.children[2].innerHTML = "Compris !";

    layer.className = "displayed";
}
