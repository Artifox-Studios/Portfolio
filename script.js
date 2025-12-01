const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

let width, height;

// ------- RESIZE STABLE -------
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ------- SNOW SETUP -------
const MAX_FLAKES = 150;
let snowflakes = [];

function initSnow() {
    snowflakes = [];
    for (let i = 0; i < MAX_FLAKES; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1 + Math.random() * 2.5,
            speed: 0.5 + Math.random() * 1,
            drift: Math.random() * 1.5
        });
    }
}
initSnow();

// ------- DRAW SNOW -------
function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";

    for (let f of snowflakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();

        f.y += f.speed;
        f.x += Math.sin(f.y * 0.01) * f.drift;

        if (f.y > height) f.y = -10;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
    }
}

// ------- INACTIVITY OVERLAY -------
let lastActivity = Date.now();
let overlayOpacity = 0;

function resetInactivity() {
    lastActivity = Date.now();
    overlayOpacity = 0;
}

["mousemove", "mousedown", "keydown", "touchstart"].forEach(ev =>
    window.addEventListener(ev, resetInactivity)
);

// ------- ANIMATION LOOP -------
function animate() {
    drawSnow();

    // Onda de nieve por inactividad
    const idle = Date.now() - lastActivity;

    if (idle > 3000) {
        overlayOpacity += 0.005;
        if (overlayOpacity > 1) overlayOpacity = 1;

        ctx.fillStyle = `rgba(255,255,255,${overlayOpacity})`;
        ctx.fillRect(0, 0, width, height);
    }

    requestAnimationFrame(animate);
}

animate();
