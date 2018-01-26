
let problems = new Array(); // liste des problèmes
let solutions = new Array(); // liste des solutions du problème en cours
let solution = new Array(); // solution unique du problème en cours

function load_problems() {
    open_file("moteur/problemes.json");
}

function open_file(file_path) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            problems = JSON.parse(xhr.responseText);
            new_problem();
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            console.out("Fichier " + file_path + " introuvable");
        }
    };
    xhr.open("GET", file_path, true);
    xhr.send();
}

function new_problem() {
    var defi = problems[Math.round(Math.random() * (problems.length - 1))];

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
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            solutions = JSON.parse(xhr.responseText);
            solution = solutions[0];
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            console.log("Fichier controleur.php inexistant");
        }
    };
    xhr.open("GET", 'controleur.php?e=' + defi["elephant"] + '&g=' + defi["gazelle"] + '&l=' + defi["lion"] + '&z=' + defi["zebre"] + '&r=' + defi["rhinoceros"], true);
    xhr.send();

}

function check_solution() {
    var correct_solution = true;

    // Pour chaque zone, si il y a une pièce, la comparer avec la solution
    for (zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.childElementCount > 9) {
            var zone_id = zone.id.substr(4); // indice de la zone (1 à 4)
            var piece = zone.lastElementChild;
            var piece_id = piece.id + "_"; // pour faire comme dans le JSON

            if (piece_id === Object.keys(solution)[parseInt(zone_id) - 1]) { // si l'élément en [indice zone - 1] a pour clef piece_id_, c'est qu'elle est au bon endroit
                console.log(zone_id + " " + piece_id + " ok");
                if (((piece_rotation(piece) % 360) / 90) + 1 == solution[piece_id]) {
                    console.log("et bien tournée");
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
    reset_pieces();

    // Pour chaque zone de la solution, y placer la pièce et la tourner
    var zone_id = 0;
    for (zone in solution) {
        var piece_id = zone.substr(0, zone.length - 1); // id de la pièce
        var piece = document.getElementById(piece_id);
        append_piece(piece, document.getElementsByTagName("zones")[0].getElementsByTagName("zone")[zone_id]);
        piece.style.transform = "rotate(" + (solution[zone] - 1) * 90 + "deg)";
        zone_id++;
    }
}

function give_clue() {
    // Pour chaque zone, si il y a une pièce, la comparer avec la solution
    for (zone of document.getElementsByTagName("zones")[0].children) {
        if (zone.childElementCount > 9) {
            var zone_id = zone.id.substr(4); // indice de la zone (1 à 4)
            var piece = zone.lastElementChild;
            var piece_id = piece.id + "_"; // pour faire comme dans le JSON

            if (piece_id === Object.keys(solution)[parseInt(zone_id) - 1]) { // si l'élément en [indice zone - 1] a pour clef piece_id_, c'est qu'elle est au bon endroit
                if ((piece_rotation(piece) / 90) + 1 == solution[piece_id]) {
                    piece.style.background = "rgba(0, 255, 0, 0.5)";
                } else {
                    piece.style.background = "rgba(255, 165, 0, 0.5)";
                }   
            } else {
                piece.style.background = "rgba(255, 0, 0, 0.5)";
            }
        }
    }

    setTimeout(function() {
        for (piece of document.querySelectorAll("piece")) {
            piece.style.background = "transparent";
        }
    }, 5000);
}
