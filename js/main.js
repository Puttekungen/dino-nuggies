// variabler som används för att hålla koll på olika saker, t.ex används difficulty till att att öka farten på allt.
let difficulty = 1;
let score = 0;
let start = 0;
let scoreStart = 0;
let isDead = false;

// skapar en canvas där allt ska ritas och hur stor den ska vara
const canvas = document.getElementById("canvas");
/** 
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
const width = 800;
const height = 500;

// variabler som är till för hur stor dinosaurien ska vara och vart den ska vara
const frameWidth = 56;
const frameHeight = 60;
const xPos = 100;
const yPos = 403.5;
const scale = 1;
let frameIndex = 0;
let count = 0;

// listor för stenarna
let objects = [];
let obsticles = []

// variabler som används för att dino ska kunna hoppa. det är gravitaion och hur mycket kraft den har
let isJumping = false;
let velocityY = 0;
const gravity = 0.55;
const jumpForce = -12;
let dinoY = yPos;



// laddar in alla bilder i spelet för att kunna användas
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

// det här används för att ändra på hur dinosaurien ska se ut. Dinosaurien är i ett spritesheet och den här koden kollar på de olika delarna i sheetet beroende på vad som ska användas
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

// de olika state dino kan vara i 
state.generateState("standing", 0, 0);
state.generateState("walk", 0, 1);
state.generateState("jump", 2, 2);
state.generateState("dead", 3, 3);

// ifall spritesheeten inte kan laddas in så ser man det i konsolen 
spriteSheet.onerror = () => {
    console.error("Failed to load the sprite sheet.");
}

// variable för vart de olika sakerna ska börja i x-led
let skyX = 0;
let forestX = 0;
let groundX = 0;
let stoneX = 1000;

// ritar de olika delarna bakgrunden består och får de att röra sig åt vänster
function displayBackground() {
    let skySpeed = 1.5 * difficulty * start;
    let forestSpeed = 2.5 * difficulty * start;
    let groundSpeed = 5.5 * difficulty * start;
    let stoneSpeed = 5.5 * difficulty * start;

    skyX -= skySpeed;
    forestX -= forestSpeed;
    groundX -= groundSpeed;
    stoneX -= stoneSpeed;

    // när någon del av bakgrunden är utanför skärmen till vänster så tas de bort och flyttas till höger
    if (skyX <= -width) skyX = 0;
    if (forestX <= -width) forestX = 0;
    if (groundX <= -width) groundX = 0;
    if (stoneX <= -64) stoneX = width;
    
    // ser till så att det alltid finns en till av samma bakgrund till höger för att det inte ska bli tomt på skärmen
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

// en klass för stenarna som tar hand om rörelse vart de ska vara i y och x-led och storleken.
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

        // Ifall dino och sten nuddar varandra så dör dinosaurien och spelet stannar
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

        // när stenen är utanför skärmen till vänster så tas den bort och det skapas en ny sten
        if (this.x < -64) {
            obsticles.push(new rock(Math.floor(Math.random() * 2)));
            obsticles.shift();
        }
    }
}

// skapar den första stenen
obsticles.push(new rock(0));

// Ritar dinosaurien beroende på vilket state som ska användas
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
    // Bestämmer hur snabbt den byter mellan de två bilderna som används för att få dinosaurien att gå
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

// funktionen som kör spelet, ritar allt, räknar poäng, ökar svårighetsgraden och hanterar hopp
function frame() {
    context.clearRect(0, 0, width, height);
    displayBackground(); 

    score += 0.2 * scoreStart;
    difficulty = 1 + Math.floor(score / 50) * 0.06;
    
    context.font = "20px Arial";
    context.fillText("Score: " + Math.floor(score), 20, 30);

    // tar hand om dinosaurien när den hoppar
    if (isJumping) {
        velocityY += gravity;
        dinoY += velocityY;
    
        if (dinoY >= yPos) {
            dinoY = yPos;
            isJumping = false;
            velocityY = 0;
        }
    }
    
    // väljer vilket state dinosaurien ska vara i beroende på vad den gör 
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

// lyssnar efter när man trycker på spacebar för att antingen göra så att dino hoppar eller starta spelet på nytt efter att man krockat med en sten
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

// när sidan öppnas så gör det här så att det spelas musik
window.onload = function() {
    var music = document.getElementById("gameMusic");
    music.play();
};

// för att starta funktionen som ser till så att spelet körs
frame();