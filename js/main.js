let difficulty = 1;
let score = 0;
let start = 0;
let scoreStart = 0;
let isDead = false;

const canvas = document.getElementById("canvas");
/** 
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
const width = 800;
const height = 500;
const frameWidth = 56;
const frameHeight = 60;
const xPos = 100;
const yPos = 403.5;
const scale = 1;
let frameIndex = 0;
let count = 0;
let objects = [];
let obsticles = []

let isJumping = false;
let velocityY = 0;
const gravity = 0.55;
const jumpForce = -12;
let dinoY = yPos;




const sky = new Image();
sky.src = "img/sky.png";
const forest = new Image();
forest.src = "img/forest.png";
const ground = new Image();
ground.src = "img/ground.png";
const rockSprite = new Image();
rockSprite.src = "img/rock_spritesheet.png";
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

const stone = {
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

// de olika state dino kan vara i 
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
let stoneX = 1000;

// ritar de olika delarna bakgrunden består av och ritar samma bild igen till höger för att det inte blir tomt
function displayBackground() {
    let skySpeed = 1.5 * difficulty * start;
    let forestSpeed = 2.5 * difficulty * start;
    let groundSpeed = 5.5 * difficulty * start;
    let stoneSpeed = 5.5 * difficulty * start;

    skyX -= skySpeed;
    forestX -= forestSpeed;
    groundX -= groundSpeed;
    stoneX -= stoneSpeed;

    if (skyX <= -width) skyX = 0;
    if (forestX <= -width) forestX = 0;
    if (groundX <= -width) groundX = 0;
    if (stoneX <= -64) stoneX = width;
    
    context.drawImage(sky, skyX, 0, width, height);
    context.drawImage(sky, skyX + width - 1, 0, width, height);

    context.drawImage(forest, forestX, 0, width, height);
    context.drawImage(forest, forestX + width, 0, width, height);

    context.drawImage(ground, groundX, 0, width, height);
    context.drawImage(ground, groundX + width, 0, width, height);

    obsticles.forEach((rock) => {
        rock.update();
    });
}

class rock {
    constructor(type) {
        this.type = type;
        this.x = 1000;
        this.y = height - 94;
        this.width = 64;
        if (this.type === 0) {
            this.height = 64;
        } else if (this.type === 1) {
            this.height = 34;
        }
        this.height = 64;
        this.speed = 5.5 * difficulty * start;
    }
    
    update() {
        this.x -= 5.5 * difficulty * start;

        context.drawImage(
            rockSprite, 
            this.width * this.type, 
            0, 
            this.width, 
            this.height, 
            this.x, 
            height - 94, 
            this.width, 
            this.height
        );

        if (start === 1 && hitbox(xPos, dinoY, this.x, height - 94)) {
        
        start = 0;
        scoreStart = 0;
        isDead = true;
        const startBtn = document.getElementById("startBtn");
        startBtn.style.display = "flex";
        startBtn.innerHTML = "Game Over! Score: " + Math.floor(score) + "<br>Press Space to Restart";
        score = 0;
        difficulty = 1;
    }

        if (this.x < -64) {
            obsticles.push(new rock(Math.floor(Math.random() * 2)));
            obsticles.shift();
        }
    }
}

obsticles.push(new rock(0));

// Ritar dinosaurien 
function animateDino(state) {
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
    // Bestämmer hur snabbt dinosaurien rör sig
    if (count > 10) {
        state.frameIndex ++;
        count = 0;
    }
    if (state.frameIndex > state.endIndex) {
        state.frameIndex = state.startIndex;
    }
}
// Funktion för att kolla om stenen och dinosaurien nuddar varandra
function hitbox(dinoX, dinoY, rockX, rockY) {
    const dinoWidth = frameWidth * 0.9;
    const dinoHeight = frameHeight * 0.9;

    const rockWidth = 60;
    const rockHeight = 40;

    return dinoX < rockX + rockWidth && dinoX + dinoWidth > rockX && dinoY < rockY + rockHeight && dinoY + dinoHeight > rockY;
}


function frame() {
    context.clearRect(0, 0, width, height);
    displayBackground(); 

    score += 0.2 * scoreStart;
    difficulty = 1 + Math.floor(score / 50) * 0.06;
    
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
    
    if (isDead) {
        animateDino(state.getState("dead"));
    } else if (start === 0) {
        animateDino(state.getState("standing")); 
    } else {
        if (isJumping) {
            animateDino(state.getState("jump"));
        } else {
            animateDino(state.getState("walk"));
        }
    }

    requestAnimationFrame(frame);
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        if (start === 1 && !isJumping) {
            isJumping = true;
            velocityY = jumpForce;
        }
    
        else if (start === 0) {
            const music = document.getElementById("gameMusic");
            music.play().catch(err => {
                console.log("Ljud kunde inte spelas:", err);
            });

            const startBtn = document.getElementById("startBtn");
            startBtn.style.display = "none";
            isDead = false;
            start = 1;
            scoreStart = 1;
            dinoY = yPos;
            obsticles = [new rock(0)];
            
            state.frameIndex = state.getState("walk").startIndex;
        }
    }
});

window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play();
};

frame();