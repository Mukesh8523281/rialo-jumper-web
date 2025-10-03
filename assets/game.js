const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let scaleX = WIDTH / 800;
let scaleY = HEIGHT / 400;
let scale = Math.min(scaleX, scaleY); // maintain aspect ratio

window.addEventListener("resize", () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  scaleX = WIDTH / 800;
  scaleY = HEIGHT / 400;
  scale = Math.min(scaleX, scaleY);
});

// --- Player ---
let player = { x: 50, y: 300, width: 50, height: 50 };
let playerVelocity = 0;
const gravity = 0.5;
const jumpStrength = -12;
const maxJumps = 2;
let jumpsLeft = maxJumps;

// --- Obstacles ---
let obstacles = [];
const obstacleWidth = 50;
let spawnTimer = 0;
let spawnInterval = 90;
let obstacleSpeed = 5;

// --- Particles ---
let particles = [];

// --- Game state ---
let score = 0;
let gameActive = false;
let gameOver = false;

// --- Input ---
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") handleJump();
});

function handleJump() {
  if (!gameActive) {
    gameActive = true;
    resetGame();
  } else if (jumpsLeft > 0) {
    playerVelocity = jumpStrength;
    jumpsLeft--;
    spawnParticles(player.x + player.width / 2, player.y + player.height);
  }
}

// --- Particle helper ---
function spawnParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * -2 - 1,
      size: Math.random() * 5 + 2,
      color: `hsl(${Math.random() * 360},100%,50%)`,
    });
  }
}

// --- Reset game ---
function resetGame() {
  player.y = HEIGHT - 100;
  playerVelocity = 0;
  obstacles = [];
  particles = [];
  score = 0;
  spawnInterval = 90;
  obstacleSpeed = 5;
  jumpsLeft = maxJumps;
  gameOver = false;
}

// --- Game loop ---
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // --- Background ---
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (gameActive) {
    // --- Player physics ---
    playerVelocity += gravity;
    player.y += playerVelocity;
    if (player.y > HEIGHT - 100) {
      player.y = HEIGHT - 100;
      playerVelocity = 0;
      jumpsLeft = maxJumps;
    }

    // --- Draw player ---
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x * scale, player.y * scale, player.width * scale, player.height * scale);

    // --- Obstacles spawn ---
    spawnTimer++;
    if (spawnTimer > spawnInterval) {
      let height = Math.random() * 80 + 50;
      obstacles.push({ x: WIDTH, y: HEIGHT - height, width: obstacleWidth, height: height });
      spawnTimer = 0;
    }

    // --- Obstacles update ---
    obstacles.forEach((obs, index) => {
      obs.x -= obstacleSpeed;

      // --- Glowing effect ---
      ctx.fillStyle = `rgba(255,0,0,0.5)`;
      ctx.fillRect(obs.x * scale - 5, obs.y * scale - 5, (obs.width + 10) * scale, (obs.height + 10) * scale);

      ctx.fillStyle = "red";
      ctx.fillRect(obs.x * scale, obs.y * scale, obs.width * scale, obs.height * scale);

      // --- Collision ---
      if (
        player.x + player.width > obs.x &&
        player.x < obs.x + obs.width &&
        player.y + player.height > obs.y &&
        player.y < obs.y + obs.height
      ) {
        gameOver = true;
        gameActive = false;
      }

      // --- Off screen ---
      if (obs.x + obs.width < 0) {
        obstacles.splice(index, 1);
        score++;
      }
    });

    // --- Particles update ---
    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.size -= 0.1;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * scale, p.y * scale, p.size * scale, 0, Math.PI * 2);
      ctx.fill();
      if (p.size <= 0) particles.splice(index, 1);
    });

    // --- Score ---
    ctx.fillStyle = "white";
    ctx.font = `${24 * scale}px sans-serif`;
    ctx.fillText(`Score: ${score}`, 20 * scale, 40 * scale);

  } else if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "red";
    ctx.font = `${64 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 50);

    ctx.fillStyle = "white";
    ctx.font = `${32 * scale}px sans-serif`;
    ctx.fillText(`Score: ${score}`, WIDTH / 2, HEIGHT / 2 + 10);

    ctx.fillStyle = "yellow";
    ctx.fillText("Press SPACE to Restart", WIDTH / 2, HEIGHT / 2 + 60);
  } else {
    ctx.fillStyle = "gold";
    ctx.font = `${48 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Rialo Jumper", WIDTH / 2, HEIGHT / 2 - 50);

    ctx.fillStyle = "white";
    ctx.font = `${32 * scale}px sans-serif`;
    ctx.fillText("Press SPACE to Start", WIDTH / 2, HEIGHT / 2 + 30);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
