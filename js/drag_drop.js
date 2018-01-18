
let dragging = false; // un élément est en cours de déplacement
let duration = 0; // durée du déplacement (ms)
let mouse_pos_actual = [0, 0]; // poition de la souris en direct (x, y)
let mouse_pos_previous = [0, 0]; // position de la souris décalée de quelques ms (modifée par move) (x, y)
let overed = null; // dropper survolé

// Récupération des éléments .draggables et .droppers et ajout des events correspondants

var draggables = document.querySelectorAll(".draggable");
for(element of draggables) {
    element.onmousedown = function() { mouse_pos_previous = mouse_pos_actual; dragging = true; move(this); };
    element.onmouseup = function() { if (duration < 200) rotate(this); dragging = false; duration = 0; this.style.visibility = "hidden"; place(this) };
}

var droppers = document.querySelectorAll(".dropper");
for(element of droppers) {
    element.onmouseover = function() { overed = this; };
    element.onmouseout = function() { overed = null; };
}


function retrieve_mouse_pos(event) {
    mouse_pos_actual = [event.clientX, event.clientY];
}

// Déplacement de la pièce en suivant le cuseur
function move(piece) {
    var piece_pos = piece_translation(piece);

    var mouse_pos_diff = [mouse_pos_actual[0] - mouse_pos_previous[0], mouse_pos_actual[1] - mouse_pos_previous[1]]; // Recalcul de la différence entre la pos actuelle et la pos précédente
    mouse_pos_previous = mouse_pos_actual;
    
    piece.style.transform = "translate(" + parseInt(piece_pos[0] + mouse_pos_diff[0]) + "px, " + parseInt(piece_pos[1] + mouse_pos_diff[1]) + "px) rotate(" + piece_rotation(piece) + "deg)"; // Translation de la figure de la différence
    
    setTimeout(function() {
        if (dragging) move(piece);
        duration += 5;
    }, 5);
}

// Placement de la pièce dans l'élement dropper survolé, null autrement
function place(piece) {
    setTimeout(function() {
        // Si la destination est non null (ca veut dire que la pièce est une zone) et contient déjà une pièce (9 squares + une piece), l'enlever
        if (overed != null && overed.childElementCount > 9) {
            append_piece(overed.lastElementChild, piece.parentNode); // récupère le parent de la pièce à placer et y met la pièce à enlever
        }

        // Si la destination est null, le parent est la base contenant les pièces
        if (overed == null) {
            overed = document.getElementsByTagName("pieces")[0];
        }

        // Ajout de la pièce à l'élément correspondant
        append_piece(piece, overed);
    }, 15);
}

function rotate(piece) {
    piece_pos = piece_translation(piece);
    piece.style.transform = "translate(" + piece_pos[0] + "px, " + piece_pos[1] + "px) rotate(" + parseInt(piece_rotation(piece) + 90) + "deg)";

    if (piece_rotation(piece) % 360 == 0) { // quand la rotation revient à 360, on repasse en outset
        for (square of piece.getElementsByTagName("square")) square.style.borderStyle = "outset";
    } else if (piece_rotation(piece) % 180 == 0) { // sinon, quand la rotation est à demi-tour, on passe en inset
        for (square of piece.getElementsByTagName("square")) square.style.borderStyle = "inset";
    }
}

// Ajoute la pièce à l'élément DOM donné
function append_piece(piece, destination) {
    // Réinitialisation de la visibilité et de la translation
    piece.style.visibility = "visible";
    piece.style.transform = "translate(0, 0) rotate(" + piece_rotation(piece) + "deg)";

    // Si la destination est la base, le style de la pièce devient base
    if (destination == document.getElementsByTagName("pieces")[0]) {
        piece.className = "base";
    }
    // Sinon, ca veut dire que destination est une zone, le style de la pièce devient donc place
    else {
        piece.className = "place";
    }

    destination.appendChild(piece);
}

function piece_translation(piece) {
    // translate(1px,2px) rotate(3deg)

    if (piece.style.transform === "") {
        return [0, 0];
    }

    var transformations = (piece.style.transform.split(')')); // coupe à )
    
    piece_pos = transformations[0].replace('(', ',').split(','); // "translate" "1px" "2px"
    piece_pos = [parseInt(piece_pos[1]), parseInt(piece_pos[2])];

    return piece_pos;
}

function piece_rotation(piece) {
    // translate(1px,2px) rotate(3deg)

    if (piece.style.transform === "") {
        return 0;
    }

    var transformations = (piece.style.transform.split(')')); // coupe à )

    if (transformations[1] === "") {
        return 0;
    }
    
    piece_angle = transformations[1].replace('(', ',').split(','); // "rotate" "3deg"
    piece_angle = parseInt(piece_angle[1]);

    return piece_angle;
}
