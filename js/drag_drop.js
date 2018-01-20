
let dragging = false; // un élément est en cours de déplacement
let duration = 0; // durée du déplacement (ms)
let mouse_pos_actual = [0, 0]; // poition de la souris en direct (x, y)
let mouse_pos_previous = [0, 0]; // position de la souris décalée de quelques ms (modifée par move) (x, y)
let overed = null; // dropper survolé

// Récupération des éléments .draggables et .droppers et ajout des events correspondants

var draggables = document.querySelectorAll(".draggable");
for(element of draggables) {
    element.onmousedown = function() { mouse_pos_previous = mouse_pos_actual; dragging = true; move(this); };
    element.onmouseup = function() { if (duration < 50) rotate(this); else { place(this); this.style.visibility = "hidden"; } dragging = false; duration = 0; };
}

var droppers = document.querySelectorAll(".dropper");
for(element of droppers) {
    element.onmouseover = function() { overed = this; };
    element.onmouseout = function() { overed = null; };
}

compute_animals();

// Récupération de la position de la souris
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

        // Actualise le nombre d'animaux cachés par rapport à l'objectif
        compute_animals();
    }, 15);
}

// Rotation la pièce de 90 degrés sans le sens horaire
function rotate(piece) {
    piece_pos = piece_translation(piece);
    piece.style.transform = "translate(" + piece_pos[0] + "px, " + piece_pos[1] + "px) rotate(" + parseInt(piece_rotation(piece) + 90) + "deg)";

    if (piece_rotation(piece) % 360 == 0) { // quand la rotation revient à 360, on repasse en outset
        for (square of piece.getElementsByTagName("square")) square.style.borderStyle = "outset";
    } else if (piece_rotation(piece) % 180 == 0) { // sinon, quand la rotation est à demi-tour, on passe en inset
        for (square of piece.getElementsByTagName("square")) square.style.borderStyle = "inset";
    }

    // Actualise le nombre d'animaux cachés par rapport à l'objectif
    compute_animals();
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

// Récupère les valeurs de la translation de la pièce
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

// Récupère la valeur de la rotation de la pièce
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

// Calcule le nombre d'animaux non cachés par les pièces
function compute_animals() {
    var nb_animals = new Array(); // nombre d'animaux

    // Compte tous les animaux
    nb_animals[0] = document.getElementById("safari").querySelectorAll(".elephant").length;
    nb_animals[1] = document.getElementById("safari").querySelectorAll(".giraffe").length;
    nb_animals[2] = document.getElementById("safari").querySelectorAll(".lion").length;
    nb_animals[3] = document.getElementById("safari").querySelectorAll(".rhino").length;
    nb_animals[4] = document.getElementById("safari").querySelectorAll(".zebra").length;

    // Pour chaque zone, décrémente les animaux cachés par leur pièce
    for(zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.id === "zone1" && zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            switch (piece.id) {
                case "piece1":
                    switch((piece_rotation(piece) % 180) / 90) {
                        case 0:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 1:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                    }
                    break;
                case "piece2":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 2; nb_animals[1] -= 0; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 1:
                            nb_animals[0] -= 2; nb_animals[1] -= 0; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                        case 2:
                            nb_animals[0] -= 2; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 3:
                            nb_animals[0] -= 2; nb_animals[1] -= 0; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                    }
                    break;
                case "piece3":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 0;
                        break;
                        case 2:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 2;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                    }
                    break;
                case "piece4":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 1:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                        break;
                        case 2:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 2;
                            break;
                        case 3:
                            nb_animals[0] -= 2; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                    }
                    break;
            }
        }
        if (zone.id === "zone2" && zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            switch (piece.id) {
                case "piece1":
                    switch((piece_rotation(piece) % 180) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece2":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 1 ; nb_animals[4] -= 0;
                            break;
                        case 1:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                        case 2:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 0; nb_animals[4] -= 0;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                    }
                    break;
                case "piece3":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 1;
                        break;
                        case 2:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece4":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 2; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 1;
                        break;
                        case 2:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 2; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                } //fin switch
            } //fin if(zone 2)
        if (zone.id === "zone3" && zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            switch (piece.id) {
                case "piece1":
                    switch((piece_rotation(piece) % 180) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 0; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece2":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 2 ; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                        case 2:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece3":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 2; nb_animals[4] -= 0;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                        break;
                        case 2:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 0; nb_animals[3] -= 2; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece4":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 2; nb_animals[4] -= 0;
                        break;
                        case 2:
                            nb_animals[0] -= 1; nb_animals[1] -= 2; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 2; nb_animals[4] -= 0;
                            break;
                    }
                    break;
            }   //fin switch
        }   // fin if(zone 3)
        if (zone.id === "zone4" && zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            switch (piece.id) {
                case "piece1":
                    switch((piece_rotation(piece) % 180) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece2":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0 ; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 2:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 0; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece3":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 0;
                        break;
                        case 2:
                            nb_animals[0] -= 0; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
                case "piece4":
                    switch((piece_rotation(piece) % 360) / 90) {
                        case 0:
                            nb_animals[0] -= 1; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                        case 1:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 0; nb_animals[3] -= 1; nb_animals[4] -= 1;
                        break;
                        case 2:
                            nb_animals[0] -= 0; nb_animals[1] -= 1; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 0;
                            break;
                        case 3:
                            nb_animals[0] -= 1; nb_animals[1] -= 0; nb_animals[2] -= 1; nb_animals[3] -= 1; nb_animals[4] -= 1;
                            break;
                    }
                    break;
            }   //fin switch
        } //fin if(zone 4)
    }

    // Affiche le nombre d'occurences de chaque animal
    var animal_id = 0;
    for(animal of document.getElementsByTagName("objectives")[0].getElementsByTagName("statut")) {
        animal.innerHTML = nb_animals[animal_id++];
    }

    // Valide les objectifs remplis
    for(objective of document.getElementsByTagName("objectives")[0].getElementsByTagName("objective")) {
        if (objective.getElementsByTagName("statut")[0].innerHTML === objective.getElementsByTagName("animal")[0].innerHTML) {
            objective.className = "valid";
        } else {
            objective.className = "";
        }
    }
}

