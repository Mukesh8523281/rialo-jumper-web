const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let WIDTH = canvas.width = window.innerWidth;
let HEIGHT = canvas.height = window.innerHeight;

// --- Assets ---
const playerImg = new Image();
playerImg.src = "assets/rialo_logo.png";
const bgImg = new Image();
bgImg.src = "assets/background.png";
const cloudImg = new Image();
cloudImg.src = "assets/clouds.png";

// --- Sounds ---
const jumpSound = new Audio("assets/jump.wav");
const doubleJumpSound = new Audio("assets/double_jump.wav");
const collisionSound = new Audio("assets/collision.wav");
const scoreSound = new Audio("assets/score.wav");
const powerupSound = new Audio("assets/powerup.wav");
const bgMusic = new Audio("assets/background_music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

// --- Player ---
const player = {
    x: 100,
    y: HEIGHT - 150,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: -12,
    jumpsLeft: 2,
    maxJumps: 2
};

// --- Background ---
let bgX = 0;
let cloudX = 0;
let cloudY = 50;
const bgSpeed = 2;
const cloudSpeed = 1;

// --- Obstacles ---
const obstacles = [];
let spawnTimer = 0;
let spawnInterval = 90;
let obstacleSpeed = 5;

// --- Particles ---
const particles = [];

// --- Powerups ---
const powerups = [];
let activePowerup = null;
let powerupTimer = 0;
const powerupDuration = 200;
let invincible = false;

// --- Score ---
let score = 0;

// --- Game state ---
let gameActive = false;
let gameOver = false;

// --- Keys ---
let keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

// --- Helpers ---
function drawText(text, x, y, size=36, color="white") {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function resetGame() {
    player.y = HEIGHT - 150;
    player.velocityY = 0;
    player.jumpsLeft = player.maxJumps;
    obstacles.length = 0;
    particles.length = 0;
    powerups.length = 0;
    score = 0;
    spawnInterval = 90;
    obstacleSpeed = 5;
    activePowerup = null;
    powerupTimer = 0;
    invincible = false;
    gameOver = false;
    gameActive = true;
}

// --- Game loop ---
function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // --- Background ---
    bgX -= bgSpeed;
    if(bgX <= -WIDTH) bgX = 0;
    cloudX -= cloudSpeed;
    if(cloudX <= -400) cloudX = 0;

    ctx.drawImage(bgImg, bgX, 0, WIDTH, HEIGHT);
    ctx.drawImage(bgImg, bgX + WIDTH, 0, WIDTH, HEIGHT);
    ctx.drawImage(cloudImg, cloudX, cloudY, 400, 100);
    ctx.drawImage(cloudImg, cloudX + 400, cloudY, 400, 100);

    if(gameActive){
        // --- Player physics ---
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        if(player.y + player.height > HEIGHT - 100){
            player.y = HEIGHT - 100 - player.height;
            player.velocityY = 0;
            player.jumpsLeft = player.maxJumps;
        }

        // --- Jump ---
        if(keys["Space"] && player.jumpsLeft > 0){
            player.velocityY = player.jumpStrength;
            if(player.jumpsLeft === 1) doubleJumpSound.play();
            else jumpSound.play();
            player.jumpsLeft--;
        }

        // --- Draw player ---
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

        // --- Obstacles ---
        spawnTimer++;
        if(spawnTimer > spawnInterval){
            const height = 50 + Math.random()*100;
            obstacles.push({x: WIDTH, y: HEIGHT - 100 - height, width: 50, height});
            spawnTimer = 0;
        }

        obstacles.forEach((obs, i)=>{
            obs.x -= obstacleSpeed;
            // --- Glow ---
            ctx.shadowColor = "red";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "red";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.shadowBlur = 0;

            // Collision
            if(!invincible && player.x < obs.x + obs.width &&
               player.x + player.width > obs.x &&
               player.y < obs.y + obs.height &&
               player.y + player.height > obs.y){
                collisionSound.play();
                gameOver = true;
                gameActive = false;
            }

            // Remove offscreen
            if(obs.x + obs.width < 0) {
                obstacles.splice(i,1);
                score++;
                scoreSound.play();
            }
        });

        // --- Score ---
        drawText("Score: "+score, 20, 40, 36, "white");

    } else if(gameOver){
        drawText("GAME OVER", WIDTH/2-120, HEIGHT/2-40, 60, "red");
        drawText("Press SPACE to Restart", WIDTH/2-160, HEIGHT/2+40, 36, "yellow");
        if(keys["Space"]) resetGame();
    } else {
        drawText("Rialo Jumper", WIDTH/2-150, HEIGHT/2-40, 60, "gold");
        drawText("Press SPACE to Start", WIDTH/2-160, HEIGHT/2+40, 36, "white");
        if(keys["Space"]) resetGame();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

// --- Responsive ---
window.addEventListener("resize", ()=>{
    WIDTH = canvas.width = window.innerWidth;
    HEIGHT = canvas.height = window.innerHeight;
});
