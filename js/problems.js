
let problems = new Array(); // liste des problèmes
let solutions = new Array(); // liste des solutions du problème en cours
let solution = new Array(); // solution unique du problème en cours

function load_problems() {
    open_file("moteur/problemes.json", load_solutions);
}

function load_solutions(responseText) {
    problems = JSON.parse(responseText);
    open_file("moteur/solutions.json",  end_loading);
}

function end_loading(responseText) {
    solutions = JSON.parse(responseText);
    new_problem();
}

function open_file(file_path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            callback(xhr.responseText);
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            console.log("Fichier " + file_path + " introuvable");
        }
    };
    xhr.open("GET", file_path, true);
    xhr.send();
}

function new_problem() {
    reset_pieces();
    
    var rand_index = Math.round(Math.random() * (problems.length - 1));
    var defi = problems[rand_index];

    // Récupère et affiche l'occurence objectif de chaque animal
    for (animal in defi) {
        switch (animal) {
            case "elephant":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("elephant")[0].innerHTML = defi[animal];
                break;
            case "gazelle":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("giraffe")[0].innerHTML = defi[animal];
                break;
            case "lion":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("lion")[0].innerHTML = defi[animal];
                break;
            case "rhinoceros":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("rhino")[0].innerHTML = defi[animal];
                break;
            case "zebre":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("zebra")[0].innerHTML = defi[animal];
                break;
        }
    }

    document.getElementsByTagName("section")[0].className = "";

    // Actualise le nombre d'animaux cachés par rapport à l'objectif
    compute_animals();

    // Exécute le moteur et charge la solution
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
    //         solutions = JSON.parse(xhr.responseText);
    //         solution = solutions[0];
    //     } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
    //         console.log("Fichier controleur.php inexistant");
    //     }
    // };
    // xhr.open("GET", 'controleur.php?e=' + defi["elephant"] + '&g=' + defi["gazelle"] + '&l=' + defi["lion"] + '&r=' + defi["rhinoceros"] + '&z=' + defi["zebre"], true);
    // xhr.send();

    // Solution déjà chargée au format JSON
    solution = solutions[rand_index];
}

function check_solution() {
    var correct_solution = true;

    /*
        piece1 : zone_id_ rotation
        piece2 : zone_id_ rotation
        ...  4
    */

    // Pour chaque zone, si il y a une pièce, la comparer avec la solution
    for (zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            var piece_id = piece.id.substr(5); // indice de la pièce (1 à 4)
            var zone_id = zone.id + "_"; // pour faire comme dans le JSON

            if (zone_id === Object.keys(solution)[parseInt(piece_id) - 1]) { // si l'élément en [indice piece - 1] a pour clef zone_id_, c'est qu'elle est au bon endroit
                // console.log(zone_id + " " + piece_id + " ok");
                var modulo = (parseInt(piece_id) == 1) ? 180 : 360;
                if (((piece_rotation(piece) % modulo) / 90) + 1 == solution[zone_id]) {
                    // console.log("et bien tournée");
                } else {
                    correct_solution = false;
                }
            } else {
                correct_solution = false;
            }
        } else {
            correct_solution = false;
        }
    }

    return correct_solution;
}

function solve_problem() {
    // Pour chaque pièce de la solution, la placer dans sa zone et la tourner
    var piece_id = 1;
    for (piece in solution) {
        var zone_id = piece.substr(0, piece.length - 1); // id de la zone (enlever le _ du JSON)
        var piece_dom = document.getElementById("piece" + piece_id);
        var zone_dom = document.getElementById(zone_id);
        append_piece(piece_dom, zone_dom);
        piece_dom.style.transform = "translate(0, 0) rotate(" + (solution[piece] - 1) * 90 + "deg)";
        piece_id++;
    }

    // Actualise le nombre d'animaux cachés par rapport à l'objectif
    compute_animals();

    display_popup("👎", "Vous avez utilisé la résolution automatique pour ce défi, vous ne gagnez donc pas de point.", "Générer un autre défi");
}

function give_clue() {
    // Pour chaque zone, si il y a une pièce, la comparer avec la solution
    for (zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            var piece_id = piece.id.substr(5); // indice de la piece (1 à 4)
            var zone_id = zone.id + "_"; // pour faire comme dans le JSON

            if (zone_id === Object.keys(solution)[parseInt(piece_id) - 1]) { // si l'élément en [indice piece - 1] a pour clef zone_id_, c'est qu'elle est au bon endroit
                if (((piece_rotation(piece) % 360) / 90) + 1 == solution[zone_id]) {
                    piece.style.background = "rgba(0, 255, 0, 0.5)";
                } else {
                    piece.style.background = "rgba(255, 165, 0, 0.5)";
                }   
            } else {
                piece.style.background = "rgba(255, 0, 0, 0.5)";
            }
        }
    }
}
