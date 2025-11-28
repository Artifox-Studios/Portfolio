// ===== STARFIELD 3D PARALLAX =====

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Generamos estrellas
const STAR_COUNT = 400;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 3 + 1, // profundidad 1–4
        size: Math.random() * 1.2 + 0.5
    });
}

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", e => {
    mouseX = (e.clientX - w / 2) / (w / 2); // [-1, 1]
    mouseY = (e.clientY - h / 2) / (h / 2);
});

// Para móviles (sensor)
window.addEventListener("deviceorientation", e => {
    if (e.gamma !== null) {
        mouseX = e.gamma / 30;
        mouseY = e.beta / 50;
    }
});

function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const star of stars) {
        let px = star.x + mouseX * star.z * 10;
        let py = star.y + mouseY * star.z * 10;

        // Wrap horizontal
        if (px < 0) px += w;
        if (px > w) px -= w;
        if (py < 0) py += h;
        if (py > h) py -= h;

        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(px, py, star.size, star.size);
    }

    requestAnimationFrame(draw);
}

draw();
