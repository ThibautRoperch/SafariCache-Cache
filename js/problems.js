
let problems = new Array();

function load_problems() {
    open_file("moteur/problemes.json");
}

function open_file(file_path) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            read_file(xhr.responseText);
        } else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
            var wait = 100;
            console.out("Fichier " + file_path + " introuvable ; nouvelle tentative dans " + wait + " ms");
            setTimeout(function() {
                open_file(file_path);
            }, wait);
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
                document.getElementsByTagName("objectives")[0].getElementsByClassName("elephant")[0].parentNode.getElementsByTagName("goal")[0].innerHTML = defi[animal];
                break;
            case "gazelle":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("giraffe")[0].parentNode.getElementsByTagName("goal")[0].innerHTML = defi[animal];
                break;
            case "lion":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("lion")[0].parentNode.getElementsByTagName("goal")[0].innerHTML = defi[animal];
                break;
            case "rhinoceros":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("rhino")[0].parentNode.getElementsByTagName("goal")[0].innerHTML = defi[animal];
                break;
            case "zebre":
                document.getElementsByTagName("objectives")[0].getElementsByClassName("zebra")[0].parentNode.getElementsByTagName("goal")[0].innerHTML = defi[animal];
                break;
        }
    }

    document.getElementsByTagName("section")[0].className = "";
}
