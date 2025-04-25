let difficulty = 1.1; // Default svårighetsgrad

let score = 0;

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

let isJumping = false;
let velocityY = 0;
const gravity = 0.6;
const jumpForce = -12;
let dinoY = yPos;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isJumping) {
        isJumping = true;
        velocityY = jumpForce;
    }
});


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


document.getElementById("startBtn").addEventListener("click", function () {
    const music = document.getElementById("gameMusic");
    music.play().catch(err => {
        console.log("Ljud kunde inte spelas:", err);
    });

    this.style.display = "none"; // Göm knappen
    // frame(); // Starta spelet efter klick
});



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

let skySpeed = 1.5 * difficulty;
let forestSpeed = 5.5 * difficulty;
let groundSpeed = 5 * difficulty;


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
        dinoY,
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

function difficulty_Level() {
    if (score > 5000) {
        difficulty = 3;
    } else if (score > 4000) {
        difficulty = 2.5;
    } else if (score > 3000) {
        difficulty = 2;
    } else if (score > 300) {
        difficulty = 1.3;
    } else if (score > 200) {
        difficulty = 1.2;
    } else if (score > 100) {
        difficulty = 1.1;
    } else {
        difficulty = 1;
    }
}

function frame() {
    context.clearRect(0, 0, width, height);
    displayBackground(); 

    score += 1; // Öka poängen varje frame
    context.font = "20px Arial";
    context.fillText("Score: " + Math.floor(score), 20, 30);

    if (isJumping) {
        velocityY += gravity;
        dinoY += velocityY;
    
        if (dinoY >= yPos) {
            dinoY = yPos;
            isJumping = false;
            velocityY = 0;
        }
    }    
    if (isJumping) {
        animate(state.getState("jump"));
    } else {
        animate(state.getState("walk"));
    }    
    requestAnimationFrame(frame);
    difficulty_Level();
    console.log(groundSpeed, forestSpeed, skySpeed);
    console.log("Svårighetsgrad: " + difficulty);
}

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play(); // Spela upp ljudet direkt
};

frame();