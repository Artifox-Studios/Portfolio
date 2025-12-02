document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('snowCanvas');
  const ctx = canvas.getContext('2d');
  const stormOverlay = document.getElementById('stormOverlay');
  if (!ctx) return console.warn('Canvas 2D no disponible.');

  let W = window.innerWidth;
  let H = window.innerHeight;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const BASE_COUNT = 120;
  const STORM_COUNT = 520;
  let targetCount = BASE_COUNT;
  let flakes = [];

  let mouseX = W/2;
  let mouseY = H/2;

  // capturar movimiento del ratón
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function initFlakes(n) {
    flakes = [];
    for (let i = 0; i < n; i++) {
      const depth = Math.random(); // 0 lejos, 1 cerca
      const size = 0.8 + depth * 3.2;
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: size,
        speed: 0.3 + depth * 3,
        drift: (Math.random() - 0.5) * (0.5 + depth),
        depth
      });
    }
  }
  initFlakes(BASE_COUNT);

  function step() {
    ctx.clearRect(0, 0, W, H);

    // ajustar cantidad de flakes
    if (flakes.length < targetCount) {
      const add = Math.min(8, targetCount - flakes.length);
      for (let i = 0; i < add; i++) {
        const depth = Math.random();
        const size = 0.8 + depth * 3.2;
        flakes.push({
          x: Math.random() * W,
          y: -10 - Math.random() * 100,
          r: size,
          speed: 0.3 + depth * 3,
          drift: (Math.random() - 0.5) * (0.5 + depth),
          depth
        });
      }
    } else if (flakes.length > targetCount) {
      flakes.length = Math.max(targetCount, flakes.length - 10);
    }

    for (let f of flakes) {
      // efecto parallax según posición del ratón
      const offsetX = (mouseX - W/2) * f.depth * 0.05;
      const offsetY = (mouseY - H/2) * f.depth * 0.05;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * f.depth})`;
      ctx.arc(f.x + offsetX, f.y + offsetY, f.r, 0, Math.PI*2);
      ctx.fill();

      f.y += f.speed;
      f.x += Math.sin(f.y * 0.008) * f.drift + Math.cos(f.y * 0.004) * 0.2;

      if (f.y > H + 6) { f.y = -8 - Math.random()*60; f.x = Math.random()*W; }
      if (f.x > W + 10) f.x = -20;
      if (f.x < -20) f.x = W + 10;
    }

    requestAnimationFrame(step);
  }
  step();

  /* -------------------
     Zorro y tormenta
  ------------------- */
  const foxContainer = document.getElementById('foxContainer');
  const fox = document.createElement('div');
  fox.className = 'fox';
  fox.innerHTML = `<div class="head"><div class="ear1"></div><div class="ear2"></div></div><div class="body"></div><div class="tail"></div>`;
  foxContainer.appendChild(fox);

  let x = -150, dir = 1;
  const foxWidth = 120;
  let vx = 160;
  let jumpAmplitude = Math.min(80,H/3);
  let jumpPeriod = 1000;
  let lastTime = null;

  let lastActivity = Date.now();
  let active = false;
  let stormStarted = false;

  function markActivity() {
    lastActivity = Date.now();
    if (stormStarted) stopStorm();
  }
  ['mousemove','mousedown','touchstart','keydown','scroll'].forEach(e=>{
    window.addEventListener(e, markActivity, {passive:true});
  });

  function applyTransform(y, currentDir) {
    fox.style.transform = `translateY(${-y}px) translateZ(0) scaleX(${currentDir*-1})`;
    foxContainer.style.left = `${Math.round(x)}px`;
  }

  function startStorm() {
    if (stormStarted) return;
    stormStarted = true;
    targetCount = STORM_COUNT;
    foxContainer.classList.add('show');
    stormOverlay.classList.add('show');
    active = true;
  }

  function stopStorm() {
    if (!stormStarted) return;
    stormStarted = false;
    targetCount = BASE_COUNT;
    foxContainer.classList.remove('show');
    stormOverlay.classList.remove('show');
    active = false;
  }

  function foxLoop(ts) {
    if (!lastTime) lastTime = ts;
    const dt = ts - lastTime;
    lastTime = ts;

    if (!active && Date.now() - lastActivity > 7000) startStorm();

    if (active) {
      x += dir * vx * (dt/1000);
      const vw = window.innerWidth;
      const leftEdge = -foxWidth - 20;
      const rightEdge = vw - foxWidth + 20;
      if (x >= rightEdge) { dir = -1; x = rightEdge; }
      if (x <= leftEdge) { dir = 1; x = leftEdge; }

      const progress = (performance.now() % jumpPeriod) / jumpPeriod;
      const y = Math.sin(Math.PI*progress) * jumpAmplitude;

      applyTransform(y, dir);
    }

    requestAnimationFrame(foxLoop);
  }

  applyTransform(0, dir);
  requestAnimationFrame(foxLoop);
  
});

const scrollContainer = document.getElementById('customScroll');
const scrollThumb = document.getElementById('scrollThumb');

function updateThumb() {
  const pageHeight = document.body.scrollHeight;
  const viewHeight = window.innerHeight;
  const scrollRatio = viewHeight / pageHeight;
  const thumbHeight = Math.max(scrollRatio * viewHeight, 40); // mínimo 40px
  scrollThumb.style.height = thumbHeight + 'px';
  
  const scrollTop = window.scrollY;
  const maxTop = viewHeight - thumbHeight;
  scrollThumb.style.top = Math.min(scrollTop / (pageHeight - viewHeight) * maxTop, maxTop) + 'px';
}

// Actualizar al hacer scroll o resize
window.addEventListener('scroll', updateThumb);
window.addEventListener('resize', updateThumb);
updateThumb();

// Arrastrar el thumb
let isDragging = false;
let startY, startTop;

scrollThumb.addEventListener('mousedown', e => {
  isDragging = true;
  startY = e.clientY;
  startTop = parseFloat(scrollThumb.style.top) || 0;
  document.body.style.userSelect = 'none';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const delta = e.clientY - startY;
  const viewHeight = window.innerHeight;
  const pageHeight = document.body.scrollHeight;
  const thumbHeight = parseFloat(scrollThumb.style.height);
  let newTop = startTop + delta;
  newTop = Math.max(0, Math.min(viewHeight - thumbHeight, newTop));
  scrollThumb.style.top = newTop + 'px';
  
  // Scroll de la página
  const scrollRatio = newTop / (viewHeight - thumbHeight);
  window.scrollTo({ top: scrollRatio * (pageHeight - viewHeight) });
});



