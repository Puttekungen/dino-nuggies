let animatedImage = document.getElementById("animatedImage");

let images = ["../img/meteor1.png", "../img/meteor2.png"];
let currentIndex = 0;

setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    meteor.src = images[currentIndex];
}, 300);

document.addEventListener("DOMContentLoaded", function () {
    let gameWindow = document.querySelector(".gamewindow");
    let position = 0;

    function scrollBackground() {
        position -= 2; // Ändra hastigheten här
        gameWindow.style.backgroundPosition = position + "px 0";
        requestAnimationFrame(scrollBackground);
    }

    scrollBackground();
});
