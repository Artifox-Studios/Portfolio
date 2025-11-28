const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
addEventListener("resize", resize);

let stars = [];
let numStars = 300;

for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 3 + 1
  });
}

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - w / 2) / 100;
  mouseY = (e.clientY - h / 2) / 100;
});

function draw() {
  ctx.clearRect(0, 0, w, h);

  for (let s of stars) {
    let x = s.x + mouseX * s.z;
    let y = s.y + mouseY * s.z;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, s.z, s.z);
  }

  requestAnimationFrame(draw);
}

draw();

