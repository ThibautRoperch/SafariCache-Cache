
let time = 0; // temps de jeu (s)
let chrono_active = false;

// Affichage du temps de jeu
function display_chrono() {
    var chrono = document.getElementsByTagName("chrono")[0];
    chrono.innerHTML = sec_to_minsec(time);

    setTimeout(function() {
        display_chrono();
    }, 1000);
}

function start_chrono() {
    if (!chrono_active) {
        chrono_active = true;

        var counter = setInterval(function() {
            if (chrono_active)
                time++;
            else
                clearInterval(counter);
        }, 1000);
    }
}

function stop_chrono() {
    chrono_active = false;
}

function reset_chrono() {
    time = 0;
}

function add_chrono(seconds) {
    time += seconds;
}

function sec_to_minsec(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
}
