const audio = document.createElement("audio");
audio.src = "https://vgmsite.com/soundtracks/kingdom-hearts-birth-by-sleep-final-mix-gamerip/swxtuvwwuv/28.mp3";

document.querySelector("#play").addEventListener("click", function() {
    audio.play();
});

document.querySelector("#pause").addEventListener("click", function() {
    audio.pause();
});