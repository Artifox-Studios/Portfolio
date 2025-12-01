document.addEventListener('DOMContentLoaded', () => {

  /* -------------------
     NIEVE
  ------------------- */
  const canvas = document.getElementById('snowCanvas');
  const ctx = canvas.getContext && canvas.getContext('2d');
  if(!ctx) console.warn('Canvas 2D no disponible.');

  let W = window.innerWidth;
  let H = window.innerHeight;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize, { passive:true });
  resize();

  const BASE_COUNT = 120;
  const STORM_COUNT = 520;
  let targetCount = BASE_COUNT;
  let flakes = [];
  function initFlakes(n){
    flakes = [];
    for(let i=0;i<n;i++){
      flakes.push({x:Math.random()*W, y:Math.random()*H, r:0.8+Math.random()*3.2, speed:0.3+Math.random()*1.6, drift:(Math.random()-0.5)*1.8});
    }
  }
  initFlakes(BASE_COUNT);

  function step(){
    ctx.clearRect(0,0,W,H);
    if(flakes.length<targetCount){
      const add = Math.min(8,targetCount-flakes.length);
      for(let i=0;i<add;i++){
        flakes.push({x:Math.random()*W, y:-10-Math.random()*100, r:0.8+Math.random()*3.2, speed:0.6+Math.random()*2.6, drift:(Math.random()-0.5)*2});
      }
    } else if(flakes.length>targetCount){ flakes.length = Math.max(targetCount, flakes.length-10); }

    for(let f of flakes){
      ctx.beginPath();
      ctx.fillStyle='rgba(255,255,255,0.95)';
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fill();
      f.y+=f.speed;
      f.x+=Math.sin(f.y*0.008)*f.drift+Math.cos(f.y*0.004)*0.2;
      if(f.y>H+6){ f.y=-8-Math.random()*60; f.x=Math.random()*W; }
      if(f.x>W+10) f.x=-20; if(f.x<-20) f.x=W+10;
    }
    requestAnimationFrame(step);
  }
  step();

  /* -------------------
     ZORRO ANIMADO
  ------------------- */
  const foxContainer = document.getElementById('foxContainer');

  // Crear estructura del zorro
  const fox = document.createElement('div');
  fox.classList.add('fox');
  fox.innerHTML = `
    <div class="head"><div class="ear1"></div><div class="ear2"></div></div>
    <div class="body"></div>
    <div class="tail"></div>
  `;
  foxContainer.appendChild(fox);

  // Variables de animación
  let x = -150;
  let dir = 1;
  let vx = 160;
  let jumpAmplitude = 80;
  let jumpPeriod = 1000;
  let lastTime = null;

  // Inactividad
  let lastActivity = Date.now();
  let active = false;

  function markActivity() {
    lastActivity = Date.now();
    active = false;
  }
  ['mousemove','mousedown','touchstart','keydown','scroll'].forEach(e=>{
    window.addEventListener(e, markActivity, {passive:true});
  });

  // Aplicar posición y salto
  function applyTransform(y, currentDir){
    fox.style.transform = `translateY(${-y}px) scaleX(${currentDir * -1})`;
    foxContainer.style.left = `${Math.round(x)}px`;
  }

  function isOnGround(progress){ return progress <= 0.02 || progress >= 0.98; }

  // Animación del zorro
  function foxLoop(ts){
    if(!lastTime) lastTime = ts;
    const dt = ts - lastTime;
    lastTime = ts;

    // Activar zorro tras 7s de inactividad
    if(!active && Date.now() - lastActivity > 7000) active = true;

    if(active){
      x += dir * vx * (dt/1000);

      const vw = window.innerWidth;
      const foxW = foxContainer.offsetWidth || 120; // fallback
      const leftEdge = -foxW - 20;
      const rightEdge = vw - foxW + 20;

      if(x >= rightEdge) { dir = -1; x = rightEdge; }
      if(x <= leftEdge) { dir = 1; x = leftEdge; }

      const jumpT = performance.now() % jumpPeriod;
      const progress = jumpT / jumpPeriod;
      const y = Math.sin(Math.PI * progress) * jumpAmplitude;

      applyTransform(y, dir);
    }

    requestAnimationFrame(foxLoop);
  }

  applyTransform(0, dir);
  requestAnimationFrame(foxLoop);

});

