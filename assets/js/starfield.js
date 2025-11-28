const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = [];
const numStars = 300;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
    });
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    for (let star of stars) {
        star.z -= 2;
        if (star.z <= 0) star.z = canvas.width;

        let k = 128 / star.z;
        let x = star.x * k + canvas.width / 2;
        let y = star.y * k + canvas.height / 2;

        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

        let size = (1 - star.z / canvas.width) * 2;
        ctx.fillRect(x, y, size, size);
    }

    requestAnimationFrame(draw);
}

draw();
