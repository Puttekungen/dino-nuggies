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
const frameWidth = 



function animate() {

}

function frame() {
    AudioContext.clearRect(0, 0, width, height);
    animate();
    requestAnimationFrame(frame);
}