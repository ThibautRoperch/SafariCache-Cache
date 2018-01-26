
function change_skin(img, skin) {
    document.getElementsByTagName("body")[0].className = skin;
    
    var skin_images = document.querySelector("aside").querySelectorAll("img");
    for (image of skin_images) {
        image.className = "";
    }
    img.className = "selected";
}
