
let problems = new Array(); // liste des problèmes
let solutions = new Array(); // liste des solutions
let records = new Array(); // liste des meilleurs scores
let current_index = -1; // indice du problème/solution/score en cours
let auto_resolution = false; // le problème en cours est résolu automatiquement

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
    reset_chrono();

    current_index = Math.round(Math.random() * (problems.length - 1));
    var defi = problems[current_index];

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

    // Affiche le meilleur score
    var best = records[current_index];
    document.getElementsByTagName("best")[0].innerHTML = (best != undefined) ? "Record : " + sec_to_minsec(best) : "Pas de meilleur score";
}

function check_solution() {
    var correct_solution = true;
    var solution = solutions[current_index];

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
    var solution = solutions[current_index];
    auto_resolution = true;

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

    display_popup("👎", "Défi terminé avec la résolution automatique.", "Générer un autre défi");
}

function give_clue() {
    var solution = solutions[current_index];
    var at_least_one_piece = false;

    // Pour chaque zone, si il y a une pièce, la comparer avec la solution
    for (zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.childElementCount > 9) {
            var piece = zone.lastElementChild;
            var piece_id = piece.id.substr(5); // indice de la piece (1 à 4)
            var zone_id = zone.id + "_"; // pour faire comme dans le JSON

            if (zone_id === Object.keys(solution)[parseInt(piece_id) - 1]) { // si l'élément en [indice piece - 1] a pour clef zone_id_, c'est qu'elle est au bon endroit
            var modulo = (parseInt(piece_id) == 1) ? 180 : 360;
            if (((piece_rotation(piece) % modulo) / 90) + 1 == solution[zone_id]) {
                    piece.style.background = "rgba(0, 255, 0, 0.5)";
                } else {
                    piece.style.background = "rgba(255, 165, 0, 0.5)";
                }   
            } else {
                piece.style.background = "rgba(255, 0, 0, 0.5)";
            }
            at_least_one_piece = true;
        }
    }

    if (at_least_one_piece)
        add_chrono(60);
}
