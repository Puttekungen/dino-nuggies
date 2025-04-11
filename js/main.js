


const canvas = document.getElementById("canvas");
/** 
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");
const width = 800;
const height = 500;
const frameWidth = 28;
const frameHeight = 30;
const xPos = 100;
const yPos = 400;
const scale = 1;
const fps = 60;
const secondsToUpdate = 1 / fps;
let frameIndex = 0;
let count = 0;


const sky = new Image();
sky.src = "img/sky.png";
const forest = new Image();
forest.src = "img/forest.png";
const ground = new Image();
ground.src = "img/ground.png";

const spriteSheet = new Image();
spriteSheet.src = "img/dino_spritesheet.png";

const state = {
    states: {},
    generateState: function(name, startIndex, endIndex) {
        if (!this.states[name]) {
            this.states[name] = {
                frameIndex: startIndex,
                startIndex: startIndex,
                endIndex: endIndex,
            };
        }
    },
    getState: function(name) {
        if (this.states[name]) {
            return this.states[name];
        }
    },
};

State.generateState("walk", 0, 1);
State.generateState("jump", 2, 2);
State.generateState("dead", 3, 3);

spriteSheet.onerror = () => {
    console.error("Failed to load the sprite sheet.");
}
function displayBackground() {
    context.drawImage(sky, 0, 0, width, height);
    context.drawImage(forest, 0, 0, width, height);
    context.drawImage(ground, 0, 0, width, height);
}
function animate(state) {
    context.drawImage(
        spriteSheet,
        state.frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        xPos,
        yPos,
        frameWidth * scale,
        frameHeight * scale
    );
    count ++;
    if (count > 15) {
        frameIndex ++;
        count = 0;
    }
    if (state.frameIndex > state.endIndex) {
        frameIndex = 0;
    }
}

function frame() {
    context.clearRect(0, 0, width, height);
    displayBackground(); 
    animate(state.getState); 
    requestAnimationFrame(frame);
}

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play(); // Spela upp ljudet direkt
};

frame();