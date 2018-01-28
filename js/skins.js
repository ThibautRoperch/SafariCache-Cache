
function change_skin(img, skin) {
    // Change la classe du body
    document.getElementsByTagName("body")[0].className = skin;
    
    // Désactive les boutons de skins et n'active que celui sélectionné
    var skin_images = document.querySelector("aside").querySelectorAll("img");
    for (image of skin_images) {
        image.className = "";
    }
    img.className = "selected";

    // Change la source de la musique thème
    var player = document.querySelector('#audioPlayer');
    player.src = "music/" + skin + ".mp3";
}
