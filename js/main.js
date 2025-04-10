


const canvas = document.getElementById("canvas");
/** 
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");
const width = 800;
const height = 500;
const frameWidth = 56;
const frameHeight = 60;
const xPos = 130;
const yPos = 400;
const scale = 1;
const fps = 60;
const secondsToUpdate = 1 / fps;
let count = 0;


const sky = new Image();
sky.src = "img/himlen.png";
const background = new Image();
background.src = "img/bakgrunden.png";

const spriteSheet = new Image();
spriteSheet.src = "img/dino_spritesheet.png";

spriteSheet.onerror = () => {
    console.error("Failed to load the sprite sheet.");
}
function displayBackgorund() {
    context.drawImage(sky, 0, 0, width, height);
    context.drawImage(background, 0, 0, width, height);
}
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
    context.clearRect(0, 0, width, height);
    displayBackgorund(); 
    animate(); 
    requestAnimationFrame(frame);
}

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play(); // Spela upp ljudet direkt
};

frame();