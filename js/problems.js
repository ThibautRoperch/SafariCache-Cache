
let problems = new Array();

function load_problems() {
    open_file("moteur/problemes.json");
}

function open_file(file_path) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            read_file(xhr.responseText);
            new_problem();
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            console.out("Fichier " + file_path + " introuvable");
        }
    };
    xhr.open("GET", file_path, true);
    xhr.send();
}

function read_file(contents) {
    problems = JSON.parse(contents);
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
            console.log(xhr.responseText);
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            console.out(":non:");
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
            var piece = zone.lastElementChild;

        } else {
            correct_solution = false;
        }
    }

    return correct_solution;
}
