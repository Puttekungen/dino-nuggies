let animatedImage = document.getElementById("animatedImage");

let images = ["../img/meteor1.png", "../img/meteor2.png"];
let currentIndex = 0;

setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    meteor.src = images[currentIndex];
}, 300);
