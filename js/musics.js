
function sound() {
    var player = document.querySelector('#audioPlayer');

    var note = document.querySelector(".note");

    if (player.paused) {
        player.play();
        note.src="img/note.png"
    } else {
        player.pause();	
        note.src="img/note_mute.png"
    }
}

function play_victory() {
    var victory = document.querySelector('#victory');
    
    victory.play();

    setTimeout(function() {
        victory.pause();
    }, victory.duration * 1000);
}
