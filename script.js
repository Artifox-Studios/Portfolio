function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

function downloadStub(){
  alert("Aquí puedes poner tu archivo CV.pdf en el futuro.");
}

function openModal(btn){
  const title = btn.dataset.title;
  const desc  = btn.dataset.desc;
  const img   = btn.dataset.img;

  const modal = document.createElement("div");
  modal.className = "modal show";
  modal.innerHTML = `
    <div class="inner">
      <h2 style="color:white">${title}</h2>
      <p class="muted">${desc}</p>
      <img style="width:100%;border-radius:10px;margin-top:10px" src="${img}">
      <button class="btn ghost" style="margin-top:12px" onclick="this.parentNode.parentNode.remove()">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);
}

// ❄ Sistema de nieve
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
resize();
window.onresize = resize;

let flakes = [];
for(let i=0;i<80;i++){
  flakes.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    s:Math.random()*2+1
  });
}

function snow(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";

  flakes.forEach(f=>{
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.s,0,Math.PI*2);
    ctx.fill();

    f.y += f.s*0.6;
    if(f.y > canvas.height) f.y = -5;
  });

  requestAnimationFrame(snow);
}

snow();

