
let popup = document.getElementById("popup");

function display_popup(emoji, message) {
    popup.children[0].innerHTML = emoji;
    popup.children[1].innerHTML = message;
    popup.className = "displayed";
}

function hide_popup() {
    popup.className = "hidden";
}
