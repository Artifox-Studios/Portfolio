/* === CONFIGURACIÓN DE NIEVE === */
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snowflakes = [];

function createSnow() {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: 0,
    speed: 1 + Math.random() * 2,
    size: 1 + Math.random() * 3
  });
}

function updateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let flake of snowflakes) {
    flake.y += flake.speed;
    if (flake.y > canvas.height) flake.y = 0;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

setInterval(createSnow, 80);
setInterval(updateSnow, 20);

/* === DETECCIÓN DE INACTIVIDAD === */
let inactivityTime = 0;
const fox = document.getElementById("fox");
let stormInterval;

function startStorm() {
  clearInterval(stormInterval);
  stormInterval = setInterval(() => {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: 0,
      speed: 4 + Math.random() * 6,
      size: 2 + Math.random() * 4
    });
  }, 40);

  fox.classList.add("active");
}

function stopStorm() {
  clearInterval(stormInterval);
  fox.classList.remove("active");
}

setInterval(() => {
  inactivityTime++;
  if (inactivityTime === 5) startStorm(); // 5 segundos sin mover TODO
}, 1000);

function resetInactivity() {
  inactivityTime = 0;
  stopStorm();
}

window.addEventListener("mousemove", resetInactivity);
window.addEventListener("keydown", resetInactivity);
window.addEventListener("touchstart", resetInactivity);

/* === AJUSTE AL REDIMENSIONAR === */
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
