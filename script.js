/* ========== NAVEGACIÓN MÓVIL ========== */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("navMobile");
menuBtn.onclick = () => nav.classList.toggle("show");

/* ========== FUNCIÓN SCROLL ========== */
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

/* ========== SISTEMA DE NIEVE GLOBAL ========== */
const canvas = document.getElementById("snowGlobal");
const ctx = canvas.getContext("2d");

function sizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
sizeCanvas();
window.onresize = sizeCanvas;

let snow = [];
let snowCount = 140;

function createSnow(){
  snow = [];
  for(let i=0;i<snowCount;i++){
    snow.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      size: Math.random()*3+1,
      speed: Math.random()*1+0.4
    });
  }
}
createSnow();

function drawSnow(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";

  snow.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.size,0,Math.PI*2);
    ctx.fill();
    f.y += f.speed;
    if(f.y > canvas.height) f.y = -10;
  });

  requestAnimationFrame(drawSnow);
}
drawSnow();

/* ========== INACTIVIDAD → TORMENTA ========== */
let inactivityTime = 0;
let stormMode = false;

setInterval(() => {
  inactivityTime += 1;

  if(inactivityTime > 15 && !stormMode){
    snowCount = 500;  // MUCHOS copos
    createSnow();
    stormMode = true;
  }
}, 1000);

function resetActivity(){
  inactivityTime = 0;
  if(stormMode){
    snowCount = 140;
    createSnow();
    stormMode = false;
  }
}

window.onmousemove = resetActivity;
window.ontouchstart = resetActivity;
window.onkeydown = resetActivity;

/* ========== NIEVE LOCAL EN FOTO DEL ZORRO ========== */
document.querySelectorAll(".snowLocal").forEach(localCanvas => {
  const localCtx = localCanvas.getContext("2d");

  function sizeLocal(){
    localCanvas.width = localCanvas.clientWidth;
    localCanvas.height = localCanvas.clientHeight;
  }
  sizeLocal();
  window.addEventListener("resize", sizeLocal);

  let flakes = [];
  for(let i=0;i<40;i++){
    flakes.push({
      x: Math.random()*localCanvas.width,
      y: Math.random()*localCanvas.height,
      s: Math.random()*2+1
    });
  }

  function animate(){
    localCtx.clearRect(0,0,localCanvas.width,localCanvas.height);
    localCtx.fillStyle="white";

    flakes.forEach(f=>{
      localCtx.beginPath();
      localCtx.arc(f.x,f.y,f.s,0,Math.PI*2);
      localCtx.fill();
      f.y += f.s*0.6;
      if(f.y > localCanvas.height) f.y = -5;
    });

    requestAnimationFrame(animate);
  }
  animate();
});
