
let layer = document.getElementsByTagName("layer")[0];
let popup = document.getElementById("popup");

function display_popup(emoji, message) {
    popup.children[0].innerHTML = emoji;
    popup.children[1].innerHTML = message;
    layer.className = "displayed";
}

function hide_popup() {
    layer.className = "hidden";
}
