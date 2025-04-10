document.addEventListener("DOMContentLoaded", function () {
    let gameWindow = document.querySelector(".gamewindow");
    let position = 0;
    let meteor = document.getElementById("meteor"); // Hämta elementet här
    let images = ["img/meteor1.png", "img/meteor2.png"];
    let currentIndex = 0;

    function scrollBackground() {
        position -= 2; // Ändra hastigheten här
        gameWindow.style.backgroundPosition = position + "px 0";
        requestAnimationFrame(scrollBackground);
    }

    scrollBackground();

    // Byt bild var 300ms
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        meteor.src = images[currentIndex];
    }, 300);
});


const canvas = document.getElementById("canvas");
const AudioContext = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const frameWidth = 56;
const frameHeight = 60;
const xPos = 130;
const yPos = 100;
const scale = 1;
const fps = 60;
const secondsToUpdate = 1 / fps;
let count = 0;

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";


const spriteSheet = new Image();
spriteSheet.src = "img/dino_walk1.png";


function animate() {
    context.drawImage(
        spriteSheet,
        0,
        0,
        frameWidth,
        frameHeight,
        xPos,
        yPos,
        frameWidth * scale,
        frameHeight * scale
    );
}

function frame() {
    AudioContext.clearRect(0, 0, width, height);
    animate();
    requestAnimationFrame(frame);
}

frame();

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play(); // Spela upp ljudet direkt
};