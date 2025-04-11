


const canvas = document.getElementById("canvas");
/** 
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");
const width = 800;
const height = 500;
const frameWidth = 56;
const frameHeight = 60;
const xPos = 100;
const yPos = 403.5;
const scale = 1;
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

state.generateState("standing", 0, 0);
state.generateState("walk", 0, 1);
state.generateState("jump", 2, 2);
state.generateState("dead", 3, 3);

spriteSheet.onerror = () => {
    console.error("Failed to load the sprite sheet.");
}

let skyX = 0;
let forestX = 0;
let groundX = 0;

const skySpeed = 1.5;
const forestSpeed = 5.5;
const groundSpeed = 10;


function displayBackground() {
    // Uppdatera positionerna
    skyX -= skySpeed;
    forestX -= forestSpeed;
    groundX -= groundSpeed;

    // Loopa bakgrunden när den rullar utanför canvas
    if (skyX <= -width) skyX = 0;
    if (forestX <= -width) forestX = 0;
    if (groundX <= -width) groundX = 0;

    // Rita varje lager två gånger för att få en sömlös loop
    context.drawImage(sky, skyX, 0, width, height);
    context.drawImage(sky, skyX + width, 0, width, height);

    context.drawImage(forest, forestX, 0, width, height);
    context.drawImage(forest, forestX + width, 0, width, height);

    context.drawImage(ground, groundX, 0, width, height);
    context.drawImage(ground, groundX + width, 0, width, height);
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
        state.frameIndex ++;
        count = 0;
    }
    if (state.frameIndex > state.endIndex) {
        state.frameIndex = state.startIndex;
    }
}

function frame() {
    context.clearRect(0, 0, width, height);
    displayBackground(); 
    animate(state.getState("standing")); 
    requestAnimationFrame(frame);
}

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play(); // Spela upp ljudet direkt
};

frame();