
let popup = document.getElementById("popup");

function display_popup(message) {
    popup.children[0].innerHTML = message;
    popup.className = "displayed";
}

function hide_popup() {
    popup.className = "hidden";
}
